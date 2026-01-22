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

    // Create business email with table-based layout
    const businessEmailContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f4f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #2c3e50; color: #ffffff; text-align: center; padding: 30px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🏗️ Nouveau Projet</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Une nouvelle demande de soumission</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #ffffff;">
                    <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">👤 Informations du Client</h2>
                    <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td style="font-weight: bold; color: #2c3e50; width: 120px; vertical-align: top;">Nom:</td>
                        <td style="color: #34495e;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #2c3e50; vertical-align: top;">Email:</td>
                        <td style="color: #34495e;"><a href="mailto:${email}" style="color: #d4a574; text-decoration: none;">${email}</a></td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="font-weight: bold; color: #2c3e50; vertical-align: top;">Téléphone:</td>
                        <td style="color: #34495e;"><a href="tel:${phone}" style="color: #d4a574; text-decoration: none;">${phone}</a></td>
                      </tr>
                      ` : ''}
                      ${service ? `
                      <tr>
                        <td style="font-weight: bold; color: #2c3e50; vertical-align: top;">Service:</td>
                        <td style="color: #34495e;">${service}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="font-weight: bold; color: #2c3e50; vertical-align: top;">Budget:</td>
                        <td style="color: #34495e;">${budgetDisplay}</td>
                      </tr>
                      ${uploadedFiles && uploadedFiles.length > 0 ? `
                      <tr>
                        <td style="font-weight: bold; color: #2c3e50; vertical-align: top;">Images:</td>
                        <td style="color: #34495e;">${uploadedFiles.length} image(s) attachée(s)</td>
                      </tr>
                      ` : ''}
                    </table>
                    
                    <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">💬 Message</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #d4a574; line-height: 1.6; color: #34495e;">
                      ${message.replace(/\n/g, '<br>')}
                    </div>
                  </td>
                </tr>
                
                <!-- Action Button -->
                <tr>
                  <td style="padding: 0 30px 40px 30px; text-align: center;">
                    <a href="mailto:${email}?subject=Re: Votre demande de soumission" style="display: inline-block; background-color: #d4a574; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
                      📧 Répondre au Client
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send business email
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

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Business email error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.'
      });
    }

    // Send confirmation email to customer
    const confirmationContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f4f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background-color: #d4a574; color: #ffffff; text-align: center; padding: 30px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✅ Merci !</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre demande a été reçue</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px; background-color: #ffffff; text-align: center;">
                    <p style="font-size: 18px; color: #2c3e50; margin: 0 0 20px 0;">Bonjour <strong>${firstName || fullName}</strong>,</p>
                    <p style="font-size: 16px; color: #34495e; line-height: 1.6; margin: 0 0 25px 0;">
                      Merci de nous avoir contactés ! Nous avons bien reçu votre demande de soumission et nous vous répondrons dans les <strong>24-48 heures</strong>.
                    </p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574;">
                      <p style="margin: 0; color: #34495e; font-size: 14px;">
                        <strong>Votre demande:</strong><br>
                        Service: ${service || 'Non spécifié'}<br>
                        Budget: ${budgetDisplay}<br>
                        ${phone ? `Téléphone: ${phone}` : ''}
                      </p>
                    </div>
                    <p style="font-size: 16px; color: #34495e; margin: 25px 0 0 0;">
                      Cordialement,<br>
                      <strong style="color: #2c3e50;">L'équipe SLC Habitation</strong>
                    </p>
                  </td>
                </tr>
              </table>
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
