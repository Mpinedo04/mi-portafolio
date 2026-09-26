/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  experimental: { globalNotFound: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/portfolio-cyber.html', destination: '/', permanent: true },
      { source: '/proyectos.html', destination: '/proyectos', permanent: true },
      { source: '/estudios.html', destination: '/estudios', permanent: true },
      { source: '/sobre-mi.html', destination: '/sobre-mi', permanent: true },
      { source: '/contacto.html', destination: '/contacto', permanent: true },
      { source: '/GUIA_LAB_SOC_WAZUH.html', destination: '/proyectos/laboratorio-soc-wazuh/informe/guia-lab-soc-wazuh', permanent: true },
      { source: '/INFORME_INCIDENTE_SSH_SOC-2026-001.html', destination: '/proyectos/laboratorio-soc-wazuh/informe/incidente-ssh-soc-2026-001', permanent: true },
      { source: '/INFORME_INCIDENTE_POWERSHELL_SOC-2026-002.html', destination: '/proyectos/laboratorio-soc-wazuh/informe/incidente-powershell-soc-2026-002', permanent: true },
      { source: '/INFORME_INCIDENTE_FIM_SOC-2026-003.html', destination: '/proyectos/laboratorio-soc-wazuh/informe/incidente-fim-soc-2026-003', permanent: true },
    ];
  },
};

export default nextConfig;
