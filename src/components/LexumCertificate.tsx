import React from 'react';

// ─── Cores ──────────────────────────────────────────────────────────────────

const NAVY = '#0B192C';
const NAVY2 = '#0F2440';
const NAVY_LIGHT = '#1A3660';
const GOLD = '#C9A84C';
const GOLD2 = '#D4B05A';
const GOLD_LIGHT = '#E0C878';
const GOLD_DIM = '#8A6E30';
const GOLD_PALE = '#A8893A';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#F8F6F0';
const TEXT = '#1E293B';
const TEXT_MUTED = '#64748B';
const SIGNATURE_GRAY = '#E8ECF2';
const BORDER_SUBTLE = '#E2E8F0';

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = '"Courier New", Courier, monospace';

// ─── Helpers ────────────────────────────────────────────────────────────────

function capitalizeName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (['de', 'da', 'do', 'dos', 'das', 'e'].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// ─── Interface ──────────────────────────────────────────────────────────────

export interface LexumCertificateProps {
  nomeDoAluno: string;
  dataEmissao: string;
  cursoName?: string;
  authCode: string;
  qrCodeDataUrl: string;
  validationUrl?: string;
}



// ─── SVG: Seal (sinete dourado) ────────────────────────────────────────────

const Seal = ({ size = 78 }: { size?: number }) => {
  const c = size / 2;
  const r = c - 3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill={NAVY2} stroke={GOLD} strokeWidth="1.5" />
      <circle cx={c} cy={c} r={r * 0.85} fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
      <path
        d={`M${c} ${c - r * 0.55}
            L${c + r * 0.18} ${c - r * 0.2}
            L${c + r * 0.5} ${c - r * 0.15}
            L${c + r * 0.25} ${c + r * 0.12}
            L${c + r * 0.3} ${c + r * 0.48}
            L${c} ${c + r * 0.25}
            L${c - r * 0.3} ${c + r * 0.48}
            L${c - r * 0.25} ${c + r * 0.12}
            L${c - r * 0.5} ${c - r * 0.15}
            L${c - r * 0.18} ${c - r * 0.2}
            Z`}
        fill={GOLD}
        opacity="0.9"
      />
      <circle cx={c} cy={c} r={r * 0.08} fill={NAVY} />
      <text
        x={c}
        y={size - 8}
        textAnchor="middle"
        fill={GOLD}
        fontSize={size * 0.065}
        fontFamily={SANS}
        fontWeight="700"
        letterSpacing="2"
      >
        LEXUM
      </text>
    </svg>
  );
};

// ─── Componente principal ──────────────────────────────────────────────────

export const LexumCertificate = React.forwardRef<HTMLDivElement, LexumCertificateProps>(
  (
    {
      nomeDoAluno,
      dataEmissao,
      cursoName = 'Extensão em Direito Previdenciário e Prática Advocatícia',
      authCode,
      qrCodeDataUrl,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={{
          width: '1123px',
          height: '794px',
          background: WHITE,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: SANS,
          boxSizing: 'border-box',
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            BORDAS — gold sólida (html2canvas compatível!)
           ═══════════════════════════════════════════════════════════════ */}

        {/* Outer gold border — sólida (html2canvas NÃO suporta borderImage) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '10px solid',
            borderColor: GOLD,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Middle gold border — com borderRadius para cantos contínuos */}
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '1.5px solid',
            borderColor: GOLD,
            opacity: 0.5,
            zIndex: 1,
            pointerEvents: 'none',
            borderRadius: '2px',
          }}
        />



        {/* ═══════════════════════════════════════════════════════════════
            MARCA D'ÁGUA
           ═══════════════════════════════════════════════════════════════ */}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: '180px',
              fontWeight: '900',
              color: NAVY,
              letterSpacing: '30px',
              opacity: 0.025,
              userSelect: 'none',
              transform: 'rotate(-8deg)',
            }}
          >
            LEXUM
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TOP DECORATIVE BAND — faixa dourada ornamental
           ═══════════════════════════════════════════════════════════════ */}

        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '36px',
            right: '36px',
            height: '4px',
            background: `linear-gradient(90deg,
              transparent 0%,
              ${GOLD} 10%,
              ${GOLD2} 30%,
              ${GOLD_LIGHT} 50%,
              ${GOLD2} 70%,
              ${GOLD} 90%,
              transparent 100%
            )`,
            zIndex: 2,
            borderRadius: '2px',
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            HEADER
           ═══════════════════════════════════════════════════════════════ */}

        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '36px',
            right: '36px',
            height: '130px',
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 50%, ${NAVY_LIGHT} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 44px',
            boxSizing: 'border-box',
            zIndex: 2,
          }}
        >
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '240px' }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: '32px',
                fontWeight: '700',
                color: GOLD,
                letterSpacing: '10px',
                lineHeight: 1,
              }}
            >
              LEXUM
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: '7px',
                color: GOLD_DIM,
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              Plataforma Jurídica de Ensino
            </div>
            <div
              style={{
                width: '50px',
                height: '1.5px',
                background: GOLD,
                opacity: 0.35,
                marginTop: '6px',
                borderRadius: '1px',
              }}
            />
          </div>

          {/* CENTER */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flex: 1,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: '22px',
                fontWeight: '700',
                color: WHITE,
                letterSpacing: '6px',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              Certificado de Conclusão
            </div>
            <div
              style={{
                width: '200px',
                height: '1.5px',
                background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
              }}
            />
            <div
              style={{
                fontFamily: SANS,
                fontSize: '9px',
                color: GOLD_PALE,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              {cursoName}
            </div>
          </div>

          {/* RIGHT: Seal */}
          <div style={{ width: '240px', display: 'flex', justifyContent: 'flex-end' }}>
            <Seal size={78} />
          </div>
        </div>

        {/* Gold line below header */}
        <div
          style={{
            position: 'absolute',
            top: '170px',
            left: '36px',
            right: '36px',
            height: '1.5px',
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            opacity: 0.5,
            zIndex: 2,
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            BODY
           ═══════════════════════════════════════════════════════════════ */}

        <div
          style={{
            position: 'absolute',
            top: '190px',
            left: '52px',
            right: '52px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: '12px',
              fontStyle: 'italic',
              color: TEXT_MUTED,
              letterSpacing: '1px',
              marginBottom: '14px',
            }}
          >
            Certificamos, para os devidos fins de direito, que
          </div>

          <div
            style={{
              fontFamily: SERIF,
              fontSize: '40px',
              fontWeight: '700',
              color: NAVY,
              letterSpacing: '1.5px',
              lineHeight: 1.25,
              marginBottom: '4px',
              maxWidth: '800px',
            }}
          >
            {capitalizeName(nomeDoAluno) || 'Nome do Aluno'}
          </div>

          <div
            style={{
              width: '360px',
              height: '2px',
              background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
              marginTop: '6px',
              marginBottom: '16px',
              borderRadius: '1px',
            }}
          />

          <div
            style={{
              fontFamily: SANS,
              fontSize: '11px',
              color: TEXT,
              lineHeight: '1.8',
              maxWidth: '660px',
            }}
          >
            concluiu com êxito o curso de extensão prática jurídica, após concluir com aproveitamento
            todos os módulos teóricos e práticos, demonstrando domínio dos conceitos fundamentais de
            peticionamento, análise de benefícios no INSS, jurisprudência e atuação prática advocatícia,
            bem como aprovação na avaliação final.
          </div>

          {/* Info block */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '640px',
              marginTop: '22px',
              gap: '1px',
              borderRadius: '6px',
              overflow: 'hidden',
              background: BORDER_SUBTLE,
            }}
          >
            {[
              { label: 'Data de Emissão', value: dataEmissao },
              { label: 'Carga Horária', value: '40 Horas' },
              { label: 'Local', value: 'Bahia — Brasil' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: OFF_WHITE,
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: '6.5px',
                    fontWeight: '700',
                    color: TEXT_MUTED,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: '13px',
                    fontWeight: '700',
                    color: NAVY,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '8px',
              fontFamily: MONO,
              fontSize: '9.5px',
              color: TEXT_MUTED,
              letterSpacing: '0.5px',
            }}
          >
            Código de Verificação:{' '}
            <span style={{ color: NAVY, fontWeight: '700', letterSpacing: '1px' }}>{authCode}</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SIGNATURE AREA
           ═══════════════════════════════════════════════════════════════ */}

        <div
          style={{
            position: 'absolute',
            bottom: '128px',
            left: '52px',
            right: '52px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '60px',
            zIndex: 2,
          }}
        >
          {/* Sig 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              width: '240px',
            }}
          >
            <div
              style={{
                border: `1px solid ${SIGNATURE_GRAY}`,
                borderRadius: '4px',
                padding: '6px 18px',
                background: OFF_WHITE,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: '6px',
                  fontWeight: '700',
                  color: TEXT_MUTED,
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                }}
              >
                Assinatura Eletrônica
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: NAVY,
                  letterSpacing: '0.5px',
                  margin: '6px 0',
                }}
              >
                Wesley Sacramento
              </div>
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: '8px',
                color: TEXT_MUTED,
                letterSpacing: '0.5px',
                textAlign: 'center',
                marginTop: '6px',
              }}
            >
              Coordenação Acadêmica
            </div>
            <div style={{ fontFamily: SANS, fontSize: '7px', color: '#94A3B8' }}>
              Curso Livre · Brasil
            </div>
          </div>

          {/* Sig 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              width: '240px',
            }}
          >
            <div
              style={{
                border: `1px solid ${SIGNATURE_GRAY}`,
                borderRadius: '4px',
                padding: '6px 18px',
                background: OFF_WHITE,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: '6px',
                  fontWeight: '700',
                  color: TEXT_MUTED,
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                }}
              >
                Assinatura Eletrônica
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: NAVY,
                  letterSpacing: '0.5px',
                  margin: '6px 0',
                }}
              >
                Direção Lexum
              </div>
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: '8px',
                color: TEXT_MUTED,
                letterSpacing: '0.5px',
                textAlign: 'center',
                marginTop: '6px',
              }}
            >
              Plataforma Lexum · Ensino Jurídico
            </div>
            <div style={{ fontFamily: SANS, fontSize: '7px', color: '#94A3B8' }}>
              Bahia — Brasil
            </div>
          </div>
        </div>

        {/* Gold line before footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '112px',
            left: '36px',
            right: '36px',
            height: '1.5px',
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            opacity: 0.4,
            zIndex: 2,
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
           ═══════════════════════════════════════════════════════════════ */}

        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '36px',
            right: '36px',
            height: '88px',
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 50%, ${NAVY_LIGHT} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            boxSizing: 'border-box',
            zIndex: 2,
          }}
        >
          {/* LEFT: QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '3px',
                  border: `2px solid ${GOLD}`,
                  padding: '2px',
                  background: WHITE,
                }}
              />
            ) : (
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  border: `2px solid ${GOLD}`,
                  borderRadius: '3px',
                  background: NAVY2,
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: '7.5px',
                  color: GOLD_PALE,
                  letterSpacing: '1px',
                  fontWeight: '600',
                }}
              >
                QR Code de Validação
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: '6.5px',
                  color: GOLD_DIM,
                  letterSpacing: '0.5px',
                }}
              >
                Escaneie para verificar autenticidade
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div
            style={{
              flex: 1,
              padding: '0 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: '7.5px',
                color: GOLD_DIM,
                lineHeight: '1.6',
              }}
            >
              Este certificado foi emitido eletronicamente pela plataforma{' '}
              <strong style={{ color: GOLD }}>Lexum</strong>.
              Válido para horas complementares. Autenticidade verificável via QR Code
              ou pelo código único em
            </div>
            <div style={{ fontFamily: SANS, fontSize: '8px', color: GOLD }}>
              <strong>lexum.studiooryon.pro/validate</strong>
            </div>
            <div
              style={{
                marginTop: '1px',
                fontFamily: MONO,
                fontSize: '9px',
                color: GOLD,
                letterSpacing: '2.5px',
                fontWeight: '700',
              }}
            >
              {authCode}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: '14px',
                fontWeight: '700',
                color: GOLD,
                letterSpacing: '4px',
              }}
            >
              LEXUM
            </div>
            <div style={{ fontFamily: SANS, fontSize: '7px', color: GOLD_DIM, letterSpacing: '0.5px' }}>
              suporte@lexum.pro
            </div>
            <div style={{ fontFamily: SANS, fontSize: '7px', color: GOLD_DIM }}>
              lexum.studiooryon.pro
            </div>
            <div
              style={{
                marginTop: '2px',
                fontFamily: SANS,
                fontSize: '6.5px',
                color: '#3d4d60',
                letterSpacing: '0.5px',
              }}
            >
              Bahia — Brasil · {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LexumCertificate.displayName = 'LexumCertificate';
