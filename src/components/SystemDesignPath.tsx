import React from 'react';
import { Shield, Layers, Globe, Code2, Zap } from 'lucide-react';
import { Card, SectionHeading } from './ui/Card';
import { Tag } from './ui/Tag';

const topics = [
  {
    level: 'Beginner',
    title: 'Fundamentals',
    Icon: Code2,
    concepts: ['Client-Server Model', 'IP/DNS', 'HTTP/HTTPS', 'REST vs GraphQL'],
  },
  {
    level: 'Intermediate',
    title: 'Scalability',
    Icon: Layers,
    concepts: ['Load Balancing', 'Caching (Redis)', 'Databases (SQL vs NoSQL)', 'Indexing'],
  },
  {
    level: 'Advanced',
    title: 'Distributed Systems',
    Icon: Globe,
    concepts: ['Microservices', 'Message Queues (Kafka)', 'Consistency Models', 'Sharding'],
  },
  {
    level: 'Expert',
    title: 'High Availability',
    Icon: Shield,
    concepts: ['DR/Failover', 'Security (OAuth, JWT)', 'Observability', 'Rate Limiting'],
  },
];

export const SystemDesignPath: React.FC = () => {
  return (
    <Card>
      <SectionHeading
        title="System Design Path"
        description="Critical for High-Package Product Roles."
        className="mb-6"
        action={<Tag className="hidden sm:inline-flex">Tiered Modules</Tag>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <div key={topic.title} className="inset p-5 group">
            <div className="w-10 h-10 rounded-[10px] bg-surface border border-separator flex items-center justify-center mb-4 text-accent transition-transform duration-150 group-hover:scale-105">
              <topic.Icon size={18} />
            </div>
            <span className="text-[13px] font-medium text-label-2">{topic.level}</span>
            <h3 className="text-[17px] font-semibold text-label mt-0.5 mb-3">{topic.title}</h3>
            <ul className="space-y-2">
              {topic.concepts.map((concept) => (
                <li key={concept} className="flex items-center gap-2 text-[13px] text-label-2">
                  <Zap size={12} aria-hidden="true" className="text-label-3 shrink-0" />
                  {concept}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
};
