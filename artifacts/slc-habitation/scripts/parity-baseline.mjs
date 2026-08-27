import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, symlink } from 'node:fs/promises';
import path from 'node:path';

/**
 * Reconstruit les images de référence du contrôle visuel (et elles seules).
 *
 * Les captures pèsent des centaines de mégaoctets : plutôt que de les
 * versionner, on rebâtit le site tel qu'il était au commit de référence
 * (`parity-reference.json`) dans une copie de travail jetable, puis on le
 * photographie. La référence reste donc exacte et reproductible, sans alourdir
 * le dépôt.
 */

const root = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(root, '..', '..');
const artifactRelative = path.relative(repoRoot, root);
const worktreeRoot = process.env.PARITY_WORKTREE || '/tmp/slc-parity-reference';

const args = process.argv.slice(2);
const shouldClean = args.includes('--clean');
const shouldRebuild = args.includes('--rebuild') || shouldClean;

function run(command, commandArgs, cwd) {
  execFileSync(command, commandArgs, { cwd, stdio: 'inherit' });
}

function capture(command, commandArgs, cwd) {
  return execFileSync(command, commandArgs, { cwd, encoding: 'utf8' }).trim();
}

async function linkDependencies(worktreeArtifact) {
  // Les dépendances sont identiques à celles de la copie principale : on les
  // partage plutôt que de réinstaller un arbre complet.
  const links = [
    [path.join(repoRoot, 'node_modules'), path.join(worktreeRoot, 'node_modules')],
    [path.join(root, 'node_modules'), path.join(worktreeArtifact, 'node_modules')],
  ];

  for (const [target, link] of links) {
    if (existsSync(link) || !existsSync(target)) continue;
    await symlink(target, link, 'dir');
  }
}

async function main() {
  const reference = JSON.parse(
    await readFile(path.join(root, 'parity-reference.json'), 'utf8'),
  );
  const commit = capture('git', ['rev-parse', reference.commit], repoRoot);
  const worktreeArtifact = path.join(worktreeRoot, artifactRelative);

  if (shouldClean && existsSync(worktreeRoot)) {
    run('git', ['worktree', 'remove', '--force', worktreeRoot], repoRoot);
  }

  if (!existsSync(worktreeRoot)) {
    console.log(`Extraction du commit de référence ${reference.commit} dans ${worktreeRoot}…`);
    await mkdir(path.dirname(worktreeRoot), { recursive: true });
    run('git', ['worktree', 'add', '--detach', worktreeRoot, commit], repoRoot);
  } else {
    const currentCommit = capture('git', ['rev-parse', 'HEAD'], worktreeRoot);
    if (currentCommit !== commit) {
      console.log(`La copie de référence pointe sur ${currentCommit.slice(0, 7)}, remise sur ${reference.commit}…`);
      run('git', ['checkout', '--detach', commit], worktreeRoot);
      await rm(path.join(worktreeArtifact, 'dist'), { recursive: true, force: true });
    }
  }

  await linkDependencies(worktreeArtifact);

  const referenceDist = path.join(worktreeArtifact, 'dist', 'public');
  if (shouldRebuild || !existsSync(referenceDist)) {
    console.log('Construction du site de référence…');
    await rm(path.join(worktreeArtifact, 'dist'), { recursive: true, force: true });
    run('pnpm', ['run', 'build'], worktreeArtifact);
  } else {
    console.log('Réutilisation de la construction de référence déjà présente (--rebuild pour la refaire).');
  }

  /* Les empreintes de structure, elles, sont versionnées et décrivent l'état
     accepté du site : elles ne se rebâtissent pas depuis le commit de
     référence, sinon chaque reconstruction des captures effacerait la
     référence approuvée. Elles se mettent à jour avec
     « pnpm run structure:baseline » quand une modification est acceptée. */

  console.log('Captures de référence…');
  run(
    'node',
    [path.join(root, 'scripts', 'visual-check.mjs'), '--update', `--dist=${referenceDist}`],
    root,
  );

  console.log(
    `\nRéférences visuelles reconstruites depuis ${reference.commit}. ` +
      'Comparez la version courante avec « pnpm run parity:check ».',
  );
}

await main();
