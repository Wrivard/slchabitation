import { Resend } from 'resend';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Parse form data with formidable
    const form = formidable({
      maxFileSize: 4 * 1024 * 1024, // 4MB per file (to account for multipart overhead)
      maxFiles: 5, // Maximum 5 files
      keepExtensions: true,
      uploadDir: '/tmp' // Temporary directory
    });

    let fields, files;
    try {
      [fields, files] = await form.parse(req);
    } catch (parseError) {
      // Handle file size errors from formidable
      if (parseError.message && (parseError.message.includes('maxFileSize') || parseError.code === 'LIMIT_FILE_SIZE')) {
        return res.status(413).json({
          success: false,
          message: 'Les images sont trop volumineuses. Veuillez réduire la taille des images ou en sélectionner moins. Maximum ~4.5MB au total.'
        });
      }
      // Re-throw other errors
      throw parseError;
    }
    
    // Extract form fields - handle both single values and arrays
    const firstName = Array.isArray(fields['Contact-6-First-Name']) ? fields['Contact-6-First-Name'][0] : fields['Contact-6-First-Name'];
    const lastName = Array.isArray(fields['Contact-6-Last-Name']) ? fields['Contact-6-Last-Name'][0] : fields['Contact-6-Last-Name'];
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const email = Array.isArray(fields['Contact-6-Email']) ? fields['Contact-6-Email'][0] : fields['Contact-6-Email'];
    const phone = Array.isArray(fields['Contact-6-Phone']) ? fields['Contact-6-Phone'][0] : fields['Contact-6-Phone'];
    const service = Array.isArray(fields['Contact-6-Select']) ? fields['Contact-6-Select'][0] : fields['Contact-6-Select'];
    const budget = Array.isArray(fields['Contact-6-Radio']) ? fields['Contact-6-Radio'][0] : fields['Contact-6-Radio'];
    const message = Array.isArray(fields['Contact-6-Message']) ? fields['Contact-6-Message'][0] : fields['Contact-6-Message'];
    
    // Extract uploaded files - handle both single file and multiple files
    let uploadedFiles = files['Contact-6-Image[]'] || files['Contact-6-Image'] || [];
    
    // Ensure uploadedFiles is always an array
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }
    
    // Filter out any undefined/null files
    uploadedFiles = uploadedFiles.filter(file => file && file.filepath);
    
    // Validate required fields
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis.'
      });
    }

    // Initialize Resend
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable missing');
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.FROM_EMAIL || 'noreply@kua.quebec';
    
    // ⚠️ HARDCODE recipient to prevent environment variable overrides
    const businessEmail = 'wrivard@kua.quebec';

    // Budget mapping for better display
    const budgetMap = {
      'Contact 6 Radio 1': '25 000$ et moins',
      'Contact 6 Radio 2': '25 000$-50 000$',
      'Contact 6 Radio 3': '50 000$-100 000$',
      'Contact 6 Radio 4': '100 000$ et plus'
    };
    const budgetDisplay = budgetMap[budget] || budget || 'Non spécifié';

    // Prepare attachments
    const attachments = [];
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file && file.filepath) {
          try {
            const fileBuffer = fs.readFileSync(file.filepath);
            const timestamp = Date.now();
            const fileExtension = file.originalFilename ? file.originalFilename.split('.').pop() : 'jpg';
            const cleanFilename = file.originalFilename ? 
              file.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_') : 
              `image_${timestamp}.${fileExtension}`;
            
            attachments.push({
              filename: cleanFilename,
              content: fileBuffer,
              contentType: file.mimetype || 'image/jpeg'
            });
          } catch (fileError) {
            console.error('Error reading file:', fileError);
          }
        }
      }
    }

    // Logo URL for emails - use absolute URL with proper domain
    const logoUrl = 'https://slchabitation.vercel.app/images/relume-567884.png';
    
    // Create business email with table-based layout and branding
    const businessEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f4f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);">
          <!-- Logo Header with White Background -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 24px 24px 24px; text-align: center; border-bottom: 3px solid #d4a574;">
              <img 
                src="${logoUrl}" 
                alt="SLC Habitation" 
                style="max-width: 200px; height: auto; margin: 0 auto; display: block;"
                onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';"
              >
              <div style="display: none; font-size: 24px; font-weight: 700; color: #0b0b0b; text-transform: uppercase; letter-spacing: 2px; margin-top: 16px;">
                SLC HABITATION
              </div>
            </td>
          </tr>
          
          <!-- Notification Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d4a574 0%, #c49a5f 100%); color: #ffffff; text-align: center; padding: 24px 30px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">🏗️ Nouveau Projet</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95; font-weight: 500;">Une nouvelle demande de soumission</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #0b0b0b; margin: 0 0 24px 0; font-size: 20px; font-weight: 700; border-bottom: 3px solid #d4a574; padding-bottom: 12px; letter-spacing: -0.3px;">👤 Informations du Client</h2>
              <table width="100%" cellpadding="10" cellspacing="0" style="margin-bottom: 32px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; width: 130px; vertical-align: top; padding: 12px 8px 12px 0;">Nom complet:</td>
                  <td style="color: #232323; padding: 12px 0;">${fullName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Email:</td>
                  <td style="color: #232323; padding: 12px 0;"><a href="mailto:${email}" style="color: #d4a574; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Téléphone:</td>
                  <td style="color: #232323; padding: 12px 0;"><a href="tel:${phone}" style="color: #d4a574; text-decoration: none; font-weight: 500;">${phone}</a></td>
                </tr>
                ` : ''}
                ${service ? `
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Service:</td>
                  <td style="color: #232323; padding: 12px 0;">${service}</td>
                </tr>
                ` : ''}
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Budget:</td>
                  <td style="color: #232323; padding: 12px 0;"><strong style="color: #d4a574;">${budgetDisplay}</strong></td>
                </tr>
                ${uploadedFiles && uploadedFiles.length > 0 ? `
                <tr>
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Images:</td>
                  <td style="color: #232323; padding: 12px 0;">
                    <span style="background-color: #d4a574; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">📷 ${uploadedFiles.length} image(s) attachée(s)</span>
                  </td>
                </tr>
                ` : ''}
              </table>
              
              <h2 style="color: #0b0b0b; margin: 32px 0 20px 0; font-size: 20px; font-weight: 700; border-bottom: 3px solid #d4a574; padding-bottom: 12px; letter-spacing: -0.3px;">💬 Message</h2>
              <div style="background: linear-gradient(to right, #f8f9fa 0%, #ffffff 100%); padding: 24px; border-radius: 8px; border-left: 4px solid #d4a574; line-height: 1.7; color: #232323; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </td>
          </tr>
          
          <!-- Action Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center; background-color: #ffffff;">
              <a href="mailto:${email}?subject=Re: Votre demande de soumission" style="display: inline-block; background: linear-gradient(135deg, #d4a574 0%, #c49a5f 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3); letter-spacing: 0.3px;">
                📧 Répondre au Client
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e8e8e8;">
              <p style="margin: 0; font-size: 12px; color: #858585; line-height: 1.6;">
                Soumission reçue via <a href="https://slchabitation.com" style="color: #d4a574; text-decoration: none; font-weight: 500;">slchabitation.com</a><br>
                <span style="color: #b5b5b5;">${new Date().toLocaleString('fr-CA', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send business email (don't block confirmation email if this fails)
    let businessEmailSent = false;
    let businessEmailError = null;
    
    try {
      const emailData = {
        from: fromEmail,
        to: businessEmail,
        subject: `🏗️ Nouveau Projet - ${fullName}${service ? ` (${service})` : ''}`,
        html: businessEmailContent,
        replyTo: email
      };

      // Add attachments if any
      if (attachments.length > 0) {
        emailData.attachments = attachments;
      }

      console.log(`Attempting to send business email to: ${businessEmail}`);
      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        businessEmailError = error;
        console.error('Business email error:', JSON.stringify(error, null, 2));
        console.error('Business email error details:', {
          message: error.message,
          name: error.name,
          statusCode: error.statusCode
        });
      } else {
        businessEmailSent = true;
        console.log('Business email sent successfully:', data);
      }
    } catch (businessEmailException) {
      businessEmailError = businessEmailException;
      console.error('Business email exception:', businessEmailException);
      console.error('Business email exception details:', {
        message: businessEmailException.message,
        stack: businessEmailException.stack
      });
    }

    // Send confirmation email to customer - matching owner email format
    const confirmationContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f4f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);">
          <!-- Logo Header with White Background -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 24px 24px 24px; text-align: center; border-bottom: 3px solid #d4a574;">
              <img 
                src="${logoUrl}" 
                alt="SLC Habitation" 
                style="max-width: 200px; height: auto; margin: 0 auto; display: block;"
                onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';"
              >
              <div style="display: none; font-size: 24px; font-weight: 700; color: #0b0b0b; text-transform: uppercase; letter-spacing: 2px; margin-top: 16px;">
                SLC HABITATION
              </div>
            </td>
          </tr>
          
          <!-- Success Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d4a574 0%, #c49a5f 100%); color: #ffffff; text-align: center; padding: 24px 30px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">✅ Merci pour votre confiance !</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95; font-weight: 500;">Votre demande a été reçue avec succès</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <p style="font-size: 18px; color: #0b0b0b; margin: 0 0 24px 0; font-weight: 600;">Bonjour <strong style="color: #d4a574;">${firstName || fullName}</strong>,</p>
              <p style="font-size: 16px; color: #232323; line-height: 1.7; margin: 0 0 32px 0;">
                Merci de nous avoir contactés ! Nous avons bien reçu votre demande de soumission et nous vous répondrons dans les <strong style="color: #0b0b0b;">24-48 heures</strong>.
              </p>
              
              <h2 style="color: #0b0b0b; margin: 32px 0 24px 0; font-size: 20px; font-weight: 700; border-bottom: 3px solid #d4a574; padding-bottom: 12px; letter-spacing: -0.3px;">📋 Récapitulatif de votre demande</h2>
              <table width="100%" cellpadding="10" cellspacing="0" style="margin-bottom: 32px; border-collapse: collapse;">
                ${service ? `
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; width: 130px; vertical-align: top; padding: 12px 8px 12px 0;">Service:</td>
                  <td style="color: #232323; padding: 12px 0;">${service}</td>
                </tr>
                ` : ''}
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Budget:</td>
                  <td style="color: #232323; padding: 12px 0;"><strong style="color: #d4a574;">${budgetDisplay}</strong></td>
                </tr>
                ${phone ? `
                <tr style="border-bottom: 1px solid #e8e8e8;">
                  <td style="font-weight: 600; color: #0b0b0b; vertical-align: top; padding: 12px 8px 12px 0;">Téléphone:</td>
                  <td style="color: #232323; padding: 12px 0;">${phone}</td>
                </tr>
                ` : ''}
              </table>
              
              <h2 style="color: #0b0b0b; margin: 32px 0 20px 0; font-size: 20px; font-weight: 700; border-bottom: 3px solid #d4a574; padding-bottom: 12px; letter-spacing: -0.3px;">⏱️ Prochaines étapes</h2>
              <div style="background: linear-gradient(to right, #f8f9fa 0%, #ffffff 100%); padding: 24px; border-radius: 8px; border-left: 4px solid #d4a574; line-height: 1.7; color: #232323; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8; font-size: 15px;">
                  <li style="margin-bottom: 8px;">Analyse de votre demande (24h)</li>
                  <li style="margin-bottom: 8px;">Préparation de la soumission détaillée</li>
                  <li style="margin-bottom: 8px;">Prise de contact pour planifier une visite si nécessaire</li>
                  <li>Remise de votre soumission personnalisée</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center; background-color: #ffffff;">
              <div style="background-color: #f8f9fa; padding: 24px; border-radius: 8px; border: 1px solid #e8e8e8;">
                <p style="margin: 0 0 12px 0; color: #0b0b0b; font-weight: 600; font-size: 16px;">Une question urgente ?</p>
                <p style="margin: 0; color: #232323; font-size: 15px; line-height: 1.8;">
                  📞 <a href="tel:(514)404-8494" style="color: #d4a574; text-decoration: none; font-weight: 600;">(514) 404-8494</a><br>
                  ✉️ <a href="mailto:slchabitation@gmail.com" style="color: #d4a574; text-decoration: none; font-weight: 600;">slchabitation@gmail.com</a>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e8e8e8;">
              <p style="margin: 0; font-size: 12px; color: #858585; line-height: 1.6;">
                Vous recevez cet email car vous avez soumis une demande sur <a href="https://slchabitation.com" style="color: #d4a574; text-decoration: none; font-weight: 500;">slchabitation.com</a><br>
                <span style="color: #b5b5b5;">${new Date().toLocaleString('fr-CA', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send confirmation email (don't fail if this fails)
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Merci pour votre demande de soumission - SLC Habitation',
        html: confirmationContent,
        replyTo: businessEmail
      });
    } catch (confirmationError) {
      console.warn('Confirmation email failed:', confirmationError);
    }

    // Clean up temporary files
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file && file.filepath) {
          try {
            fs.unlinkSync(file.filepath);
          } catch (cleanupError) {
            console.error('Error cleaning up file:', cleanupError);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès!',
      data: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur. Veuillez réessayer plus tard.'
    });
  }
}
