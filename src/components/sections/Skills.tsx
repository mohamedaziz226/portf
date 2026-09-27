import { Reveal, Section, Stagger, StaggerItem, TechIcon } from "@/components/ui";
import { skillGroups } from "@/data";

export function Skills() {
  return (
    <Section
      id="skills"
      title="Toolkit & Skills"
      description={
        <span className="gradient-text font-semibold uppercase tracking-[0.18em]">
          Professional Skillset
        </span>
      }
      headingClassName="mx-auto text-center"
      className="overflow-hidden below-fold"
    >
      {/* Decorative halftone dots — echoes the group layout without adding noise. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <div className="absolute left-0 top-24 h-52 w-52 bg-dot-grid bg-dot opacity-40 [mask-image:radial-gradient(circle_at_top_left,black,transparent_72%)]" />
        <div className="absolute bottom-24 right-0 h-52 w-52 bg-dot-grid bg-dot opacity-40 [mask-image:radial-gradient(circle_at_bottom_right,black,transparent_72%)]" />
      </div>

      <div className="relative space-y-10 sm:space-y-14">
        {skillGroups.map((group, groupIndex) => (
          <section key={group.id} aria-labelledby={`skills-${group.id}`}>
            <Reveal y={16} delay={groupIndex * 0.04}>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <span
                  className="h-px w-6 bg-gradient-to-r from-transparent to-sky-400/50 sm:w-12"
                  aria-hidden="true"
                />
                <h3
                  id={`skills-${group.id}`}
                  className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-400 sm:text-xs"
                >
                  {group.label}
                </h3>
                <span
                  className="h-px w-6 bg-gradient-to-l from-transparent to-sky-400/50 sm:w-12"
                  aria-hidden="true"
                />
              </div>
            </Reveal>

            <Stagger delay={0.05} gap={0.045} className="mt-6 sm:mt-8">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4" role="list">
              {group.items.map((item) => (
                <StaggerItem key={item.name} y={16} className="flex">
                    <div className="glass-card group flex h-[6.4rem] w-[6.4rem] flex-col items-center justify-center gap-2.5 px-2 text-center transition duration-300 ease-smooth hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-glow sm:h-[7.25rem] sm:w-[7.25rem]">
                      <TechIcon
                        id={item.icon}
                        className="h-8 w-8 transition duration-300 ease-smooth group-hover:scale-110 group-hover:-rotate-6 sm:h-9 sm:w-9"
                      />
                      <span className="text-[0.68rem] font-medium leading-tight text-slate-300 transition duration-300 ease-smooth group-hover:text-white sm:text-xs">
                        {item.name}
                      </span>
                    </div>
                </StaggerItem>
              ))}
              </div>
            </Stagger>
          </section>
        ))}
      </div>
    </Section>
  );
}
