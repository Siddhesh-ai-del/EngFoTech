import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckSquare, ExternalLink, Lightbulb, ChevronRight, Rocket } from 'lucide-react';
import { RoadmapStep } from '../types';
import { PageNavigation } from './PageNavigation';
import { Tag } from './ui/Tag';

interface RoadmapViewProps {
  roadmap: RoadmapStep[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap }) => {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-10 text-center space-y-2">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-label">Strategic Roadmap</h1>
        <p className="text-[15px] text-label-2">
          A multi-phase structure to engineering excellence.
        </p>
      </header>

      <div className="relative">
        <div
          className="absolute left-0 right-0 top-[20px] h-px bg-separator hidden lg:block"
          aria-hidden="true"
        />

        <ol className="flex list-none flex-col lg:flex-row gap-6 overflow-x-auto pb-6 snap-x">
          {roadmap.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
              className="relative flex-shrink-0 w-full lg:w-[320px] snap-center"
            >
              <div
                className="hidden lg:flex absolute left-8 top-0 w-10 h-10 rounded-full bg-accent-fill text-white shadow-pop items-center justify-center z-10"
                aria-hidden="true"
              >
                <Calendar size={18} />
              </div>

              <article className="card lg:mt-12 p-6 flex flex-col h-full">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <p className="text-[13px] font-medium text-label-2">{step.month}</p>
                    <h2 className="text-[17px] font-semibold text-label mt-0.5 leading-snug">
                      {step.milestone}
                    </h2>
                  </div>
                  <span className="chip">Phase {index + 1}</span>
                </div>

                <div className="space-y-6 flex-1">
                  <section className="space-y-3">
                    <h3 className="flex items-center gap-2 text-[13px] font-medium text-label-2">
                      <CheckSquare size={14} className="text-accent" aria-hidden="true" />
                      Milestone Goals
                    </h3>
                    <ul className="space-y-2">
                      {step.tasks.map((task, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[15px] leading-relaxed text-label"
                        >
                          <ChevronRight
                            size={15}
                            className="text-label-3 shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {step.proTips && step.proTips.length > 0 && (
                    <section className="inset p-4">
                      <h3 className="flex items-center gap-2 text-[13px] font-medium text-label-2 mb-2">
                        <Lightbulb size={14} className="text-orange-text" aria-hidden="true" />
                        AI Advisor Tips
                      </h3>
                      <ul className="space-y-1.5">
                        {step.proTips.map((tip, i) => (
                          <li
                            key={i}
                            className="text-[15px] leading-relaxed text-label flex items-start gap-2"
                          >
                            <span className="text-label-3" aria-hidden="true">
                              •
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className="space-y-3">
                    <h3 className="flex items-center gap-2 text-[13px] font-medium text-label-2">
                      <Rocket size={14} className="text-accent" aria-hidden="true" />
                      Portfolio Projects
                    </h3>
                    <ul className="space-y-2">
                      {step.projects.map((project, i) => (
                        <li key={i} className="inset px-3 py-2.5">
                          {typeof project === 'string' ? (
                            <span className="text-[15px] font-medium text-label">{project}</span>
                          ) : (
                            <>
                              <p className="text-[15px] font-medium text-label">{project.title}</p>
                              {project.description ? (
                                <p className="text-[13px] text-label-2 mt-0.5">
                                  {project.description}
                                </p>
                              ) : null}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-[13px] font-medium text-label-2">Curated Resources</h3>
                    <ul className="space-y-2">
                      {step.resources.map((res, i) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inset group flex items-center justify-between p-3 hover:bg-surface hover:border-accent transition-colors duration-200"
                          >
                            <span className="text-[15px] text-label truncate max-w-[150px] group-hover:text-accent transition-colors duration-200">
                              {res.name}
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              <Tag tone={res.type === 'free' ? 'green' : 'orange'}>{res.type}</Tag>
                              <ExternalLink
                                size={14}
                                className="text-label-3 group-hover:text-accent transition-colors duration-200"
                                aria-hidden="true"
                              />
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
      <PageNavigation />
    </div>
  );
};
