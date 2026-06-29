import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <section style={{
        minHeight: '100vh',
        background: 'var(--navy-950)',
        color: 'var(--text-primary)',
        padding: 'clamp(80px, 12vw, 120px) 0',
      }}>
        <div className="section-container" style={{ maxWidth: 800 }}>
          <h1 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 500,
            color: '#FFFFFF',
            marginBottom: 24,
            lineHeight: 1.2,
          }}>
            Política de Privacidade
          </h1>
          
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            marginBottom: 48,
            lineHeight: 1.7,
          }}>
            Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                title: '1. Coleta de Informações',
                content: 'Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de cadastro quando você se registra em nossa plataforma. Também coletamos informações sobre seu progresso nos cursos, resultados de avaliações e atividades de aprendizagem.'
              },
              {
                title: '2. Uso das Informações',
                content: 'Utilizamos suas informações para fornecer nossos serviços de formação complementar, acompanhar seu progresso nos cursos, emitir certificados, melhorar nossa plataforma e comunicar informações importantes sobre sua conta e cursos.'
              },
              {
                title: '3. Compartilhamento de Dados',
                content: 'Não vendemos suas informações pessoais. Seus dados podem ser compartilhados apenas quando necessário para operar nossa plataforma, emitir certificados ou quando exigido por lei. Não compartilhamos seus dados com terceiros para fins de marketing.'
              },
              {
                title: '4. Segurança dos Dados',
                content: 'Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração ou destruição. Utilizamos criptografia SSL e seguimos as melhores práticas de segurança da informação.'
              },
              {
                title: '5. Seus Direitos',
                content: 'Você tem direito a acessar, corrigir, excluir seus dados pessoais e revogar consentimentos. Para exercer esses direitos, entre em contato conosco através do e-mail informado no rodapé do site.'
              },
              {
                title: '6. Cookies',
                content: 'Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do navegador.'
              },
              {
                title: '7. Menores de Idade',
                content: 'Nossos cursos são destinados a maiores de idade. Não coletamos intencionalmente informações de menores de 18 anos. Se tomarmos conhecimento de coleta não intencional, tomaremos medidas para remover essas informações.'
              },
              {
                title: '8. Alterações nesta Política',
                content: 'Podemos atualizar esta política de privacidade periodicamente. Notificaremos os usuários sobre alterações significativas através de aviso em nossa plataforma ou por e-mail. O uso contínuo da plataforma após alterações constitui aceitação dos novos termos.'
              },
              {
                title: '9. Contato',
                content: 'Para dúvidas sobre esta política de privacidade ou para exercer seus direitos de proteção de dados, entre em contato conosco pelo e-mail disponível no rodapé deste site.'
              },
            ].map((section, index) => (
              <div key={index}>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: 12,
                  fontFamily: 'var(--font-sans)',
                }}>
                  {section.title}
                </h2>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: 'rgba(168,180,196,0.9)',
                }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 64,
            padding: 24,
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 12,
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--gold-300)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              <strong>Nota:</strong> Esta plataforma oferece cursos livres de formação complementar e não substitui cursos regulares de graduação ou pós-graduação. Os certificados emitidos têm caráter de atestado de participação em atividades de extensão.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
