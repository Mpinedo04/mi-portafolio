export const metadata = {
  title: 'Administración · Miguel Pinedo',
  description: 'Studio del portfolio personal de Miguel Pinedo.',
};

export default function AdminLayout({ children }) {
  return <html lang="es"><body style={{ margin: 0, minHeight: '100vh' }}>{children}</body></html>;
}
