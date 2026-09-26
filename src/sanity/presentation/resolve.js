import { defineLocations } from 'sanity/presentation';

export const resolve = {
  locations: {
    settings: defineLocations({ resolve: () => ({ locations: [
      { title: 'Inicio', href: '/' },
      { title: 'Proyectos', href: '/proyectos' },
      { title: 'Sobre mí', href: '/sobre-mi' },
      { title: 'Estudios', href: '/estudios' },
      { title: 'Contacto', href: '/contacto' },
    ] }) }),
    home: defineLocations({ resolve: () => ({ locations: [{ title: 'Inicio', href: '/' }] }) }),
    about: defineLocations({ resolve: () => ({ locations: [{ title: 'Sobre mí', href: '/sobre-mi' }] }) }),
    workstation: defineLocations({ resolve: () => ({ locations: [{ title: 'Sobre mí', href: '/sobre-mi' }] }) }),
    studies: defineLocations({ resolve: () => ({ locations: [{ title: 'Estudios', href: '/estudios' }] }) }),
    contact: defineLocations({ resolve: () => ({ locations: [{ title: 'Contacto', href: '/contacto' }] }) }),
    project: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({ locations: [
        { title: doc?.title || 'Proyecto', href: `/proyectos/${doc?.slug || ''}` },
        { title: 'Todos los proyectos', href: '/proyectos' },
      ] }),
    }),
    report: defineLocations({
      select: { title: 'title', slug: 'slug.current', projectSlug: 'project->slug.current' },
      resolve: (doc) => ({ locations: [
        { title: doc?.title || 'Informe', href: `/proyectos/${doc?.projectSlug || 'laboratorio-soc-wazuh'}/informe/${doc?.slug || ''}` },
        { title: 'Proyectos', href: '/proyectos' },
      ] }),
    }),
  },
};
