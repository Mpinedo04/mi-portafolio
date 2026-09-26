import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { client, sanityReady } from '@/sanity/lib/client';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const type = body?._type;
    const slug = body?.slug?.current || body?.slug;
    const paths = new Set(['/']);
    if (type === 'settings' || type === 'home') ['/proyectos', '/estudios', '/sobre-mi', '/contacto'].forEach((path) => paths.add(path));
    if (type === 'project') {
      paths.add('/proyectos');
      if (slug) {
        paths.add(`/proyectos/${slug}`);
        paths.add(`/proyectos/${slug}/informe`);
      }
      if (sanityReady && body?._id) {
        const reportSlugs = await client.fetch('*[_type == "report" && references($projectId)].slug.current', { projectId: body._id });
        reportSlugs.forEach((reportSlug) => paths.add(`/proyectos/${slug}/informe/${reportSlug}`));
      }
    }
    if (type === 'report') {
      paths.add('/proyectos');
      const projectId = body?.project?._ref || body?.project?._id;
      if (sanityReady && projectId) {
        const projectSlug = await client.fetch('*[_type == "project" && _id == $id][0].slug.current', { id: projectId });
        if (projectSlug) {
          paths.add(`/proyectos/${projectSlug}`);
          paths.add(`/proyectos/${projectSlug}/informe`);
          if (slug) paths.add(`/proyectos/${projectSlug}/informe/${slug}`);
        }
      }
    }
    if (type === 'studies') paths.add('/estudios');
    if (type === 'about' || type === 'workstation') paths.add('/sobre-mi');
    if (type === 'contact') paths.add('/contacto');
    paths.forEach((path) => revalidatePath(path));
    return NextResponse.json({ revalidated: true, paths: [...paths] });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating', error: error.message }, { status: 500 });
  }
}
