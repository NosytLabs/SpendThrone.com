import { Card, Button, RoyalCard, GlowCard, useToast, RoyalIcon, GlowPulse } from '../components/ui';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Section } from '../components/layout/Section';
import { TIERS } from '@/shared/utils/tierSystem';
import strings from '@/locales/strings.json';

const Tiers = () => {
  const { addToast } = useToast();

  return (
    <PageLayout
      maxWidth="full"
      showBackgroundEffects={true}
    >
      <PageHeader
        title={strings.tiers.page_title}
        subtitle={strings.tiers.page_subtitle}
        icon={<RoyalIcon variant="crown" size={48} className="drop-shadow-glow" />}
        variant="compact"
      />
      <Section className="w-full max-w-7xl mx-auto">
        {/* THE PODIUM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 items-end max-w-6xl mx-auto">
          {/* RANK 2 - SILVER NOBLE */}
          <GlowCard
            glowOnHover={true}
            entrance="slide-up"
            entranceDelay={300}
            className="p-8 text-center md:order-1 order-2 transform md:translate-y-8 border-4 border-tier-silver/20 bg-gradient-to-b from-surface-tertiary/50 to-background-primary cursor-pointer"
            onClick={() => addToast({
              type: 'info',
              title: strings.tiers.rank_silver_title,
              description: strings.tiers.rank_silver_desc,
              duration: 3000
            })}
          >
            <div className="text-6xl mb-4">🥈</div>
            <h3 className="royal-text-title text-text-primary mb-2">{strings.tiers.rank_silver_title}</h3>
            <p className="text-lg text-text-secondary mb-6 font-serif italic">{strings.tiers.rank_silver_amount}</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-text-primary">
                <RoyalIcon variant="trophy" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-silver)]" />
                <span>{strings.tiers.rank_silver_badge}</span>
              </div>
              <div className="flex items-center gap-3 text-text-primary">
                <RoyalIcon variant="star" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-silver)]" />
                <span>{strings.tiers.rank_silver_border}</span>
              </div>
            </div>
          </GlowCard>

          {/* RANK 1 - DIAMOND EMPEROR */}
          <RoyalCard
            glowOnHover={true}
            entrance="scale"
            entranceDelay={500}
            className="p-8 md:p-10 text-center md:order-2 order-1 transform md:-translate-y-8 z-10 border-4 border-accent-secondary shadow-2xl shadow-accent-secondary/30 bg-gradient-to-b from-accent-secondary/20 via-accent-secondary/10 to-black relative overflow-visible cursor-pointer mb-8 md:mb-0"
            onClick={() => addToast({
              type: 'success',
              title: strings.tiers.rank_diamond_title,
              description: strings.tiers.rank_diamond_desc,
              duration: 4000
            })}
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <RoyalIcon variant="crown" size={64} className="filter drop-shadow-[0_0_15px_var(--color-gold-400)]" />
            </div>
            <div className="mt-12">
              <div className="text-8xl mb-4">👑</div>
              <h3 className="royal-text-hero text-accent-secondary mb-3 drop-shadow-glow text-2xl md:text-3xl">{strings.tiers.rank_diamond_display}</h3>
              <p className="text-xl text-white mb-8 font-serif italic">{strings.tiers.rank_diamond_amount}</p>
              <div className="space-y-4 text-left bg-black/30 p-6 rounded-lg border border-accent-secondary/30">
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="star" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">{strings.tiers.rank_diamond_benefit1}</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="diamond" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">{strings.tiers.rank_diamond_benefit2}</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="fire" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">{strings.tiers.rank_diamond_benefit3}</span>
                </div>
              </div>
            </div>
          </RoyalCard>

          {/* RANK 3 - BRONZE KNIGHT */}
          <GlowCard
            glowOnHover={true}
            entrance="slide-up"
            entranceDelay={700}
            className="p-8 text-center md:order-3 order-3 transform md:translate-y-8 border-4 border-tier-bronze/40 bg-gradient-to-b from-tier-bronze/20 to-background-primary cursor-pointer"
            onClick={() => addToast({
              type: 'warning',
              title: strings.tiers.rank_bronze_title,
              description: strings.tiers.rank_bronze_desc,
              duration: 2500
            })}
          >
            <div className="text-6xl mb-4">🥉</div>
            <h3 className="royal-text-title text-tier-bronze mb-2">{strings.tiers.rank_bronze_title}</h3>
            <p className="text-lg text-tier-bronze mb-6 font-serif italic">{strings.tiers.rank_bronze_amount}</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-tier-bronze">
                <RoyalIcon variant="shield" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-bronze)]" />
                <span>{strings.tiers.rank_bronze_badge}</span>
              </div>
              <div className="flex items-center gap-3 text-tier-bronze">
                <RoyalIcon variant="target" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-bronze)]" />
                <span>{strings.tiers.rank_bronze_border}</span>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* COMPARISON TABLE - REPLACES FULL TIER LIST */}
        <div className="container mx-auto w-full mb-12">
          <h2 className="royal-text-title text-white mb-8 text-center">{strings.tiers.complete_hierarchy}</h2>
          
          {/* Mobile Card View (Visible on small screens) */}
          <div className="md:hidden grid gap-6 mb-8">
             {TIERS.map((tier) => (
               <RoyalCard key={tier.id} variant="glass" className="p-6 border-l-4 border-accent-secondary/30 hover:border-accent-secondary transition-colors group">
                 <div className="flex items-start justify-between mb-4">
                   <div className="text-4xl group-hover:scale-110 transition-transform">{tier.badge}</div>
                   <div className="text-right">
                     <p className="text-xs text-text-muted uppercase tracking-wider">{strings.tiers.col_threshold}</p>
                     <p className="text-accent-primary font-bold font-mono">${tier.minUsd.toLocaleString()}</p>
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">{tier.displayName}</h3>
                 <p className="text-sm text-text-secondary mb-4 min-h-[40px]">{tier.description}</p>
                 <ul className="space-y-2">
                   {tier.benefits.map((benefit, idx) => (
                     <li key={idx} className="text-xs text-text-muted flex items-center gap-2">
                       <RoyalIcon variant="check" size={12} className="text-success" />
                       {benefit}
                     </li>
                   ))}
                 </ul>
               </RoyalCard>
             ))}
          </div>

          {/* Desktop Table View (Visible on md+) */}
          <div className="hidden md:block overflow-x-auto">
            <RoyalCard variant="glass" className="p-0 border border-accent-primary/20 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-text-muted text-sm uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 font-semibold">Tier</th>
                    <th className="p-4 font-semibold text-right">Contribution</th>
                    <th className="p-4 font-semibold text-center">Badge</th>
                    <th className="p-4 font-semibold text-center">Border</th>
                    <th className="p-4 font-semibold text-center">Discord Role</th>
                    <th className="p-4 font-semibold text-center">Multiplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TIERS.map((tier) => (
                    <tr key={tier.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tier.icon}</span>
                          <div>
                            <div className="font-bold text-white group-hover:text-accent-primary transition-colors">{tier.displayName}</div>
                            <div className="text-xs text-text-muted">{tier.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-accent-primary">
                        ${tier.minUsd.toLocaleString()}+
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-2xl" title={`${tier.name} Badge`}>{tier.badge}</span>
                      </td>
                      <td className="p-4 text-center">
                        <div className={`w-6 h-6 mx-auto rounded-full border-2 border-${tier.id.includes('gold') ? 'accent-primary' : tier.id.includes('silver') ? 'gray-400' : tier.id.includes('bronze') ? 'orange-700' : tier.id.includes('diamond') ? 'cyan-400' : 'gray-700'}`}></div>
                      </td>
                      <td className="p-4 text-center">
                        {tier.minUsd >= 50 ? (
                          <RoyalIcon variant="check" size={18} className="text-success mx-auto" />
                        ) : (
                          <RoyalIcon variant="close" size={18} className="text-error/50 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center font-mono text-text-secondary">
                        {tier.multiplier}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </RoyalCard>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <Section
          title={strings.tiers.section_how_rankings_work}
          subtitle={strings.tiers.section_how_rankings_work_subtitle}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="glass" className="p-8 border-l-4 border-accent-primary">
              <h4 className="royal-text-subtitle text-white mb-4 flex items-center gap-2">
                <RoyalIcon variant="trend" size={28} className="drop-shadow-glow" />
                {strings.tiers.dynamic_ranking_title}
              </h4>
              <p 
                className="text-text-secondary text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: strings.tiers.dynamic_ranking_desc }}
              />
              <Button as="link" to="/history" variant="ghost" size="sm" className="mt-4 text-accent-primary hover:underline p-0">
                {strings.tiers.learn_more_link}
              </Button>
            </Card>
            <Card variant="glass" className="p-8 border-l-4 border-accent-primary">
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <RoyalIcon variant="crown" size={28} className="filter drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                {strings.tiers.crown_title}
              </h4>
              <p 
                className="text-text-secondary text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: strings.tiers.crown_desc }}
              />
            </Card>
          </div>
        </Section>

        {/* CTA */}
        <RoyalCard className="mt-12 text-center p-12 bg-gradient-to-r from-accent-secondary via-accent-secondary to-accent-secondary rounded-2xl shadow-2xl border-4 border-white/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4 font-cinzel">
              Will You Be Emperor?
            </h2>
            <p className="text-xl md:text-2xl text-black/90 mb-8 max-w-2xl mx-auto font-medium font-serif italic">
              The throne is waiting. The only question is: how much are you willing to pay for eternal glory?
            </p>
            <GlowPulse color="gold" intensity="strong" duration={2000}>
              <Button 
                as="link"
                to="/"
                size="lg"
                className="bg-black text-accent-primary font-bold py-4 px-12 rounded-full text-xl hover:scale-110 transition-transform shadow-2xl border-4 border-accent-secondary h-auto"
                onClick={() => addToast({
                  type: 'success',
                  title: 'Claim Your Throne!',
                  description: "Time to show them who's boss!",
                  duration: 3500
                })}
              >
                <RoyalIcon variant="crown" className="mr-3 text-gold-500" />
                Pay Tribute Now
              </Button>
            </GlowPulse>
          </div>
           {/* Decorative background elements */ }
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_60%)] animate-spin-slow opacity-50"></div>
          </div>
        </RoyalCard>
      </Section>
    </PageLayout>
  );
};

export default Tiers;
