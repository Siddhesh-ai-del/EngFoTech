import React from 'react';
import { motion } from 'motion/react';
import { Database, Layout, Server, Shield, Zap, Layers, Globe, Code2 } from 'lucide-react';

const topics = [
  { level: 'Beginner', title: 'Fundamentals', icon: <Code2 size={24} />, concepts: ['Client-Server Model', 'IP/DNS', 'HTTP/HTTPS', 'REST vs GraphQL'] },
  { level: 'Intermediate', title: 'Scalability', icon: <Layers size={24} />, concepts: ['Load Balancing', 'Caching (Redis)', 'Databases (SQL vs NoSQL)', 'Indexing'] },
  { level: 'Advanced', title: 'Distributed Systems', icon: <Globe size={24} />, concepts: ['Microservices', 'Message Queues (Kafka)', 'Consistency Models', 'Sharding'] },
  { level: 'Expert', title: 'High Availability', icon: <Shield size={24} />, concepts: ['DR/Failover', 'Security (OAuth, JWT)', 'Observability', 'Rate Limiting'] }
];

export const SystemDesignPath: React.FC = () => {
  return (
    <div className="p-6 bg-dark-blue dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Database size={120} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-black tracking-tighter">System Design Path</h2>
          <p className="text-xs text-white/50 font-medium">Critical for High-Package Product Roles.</p>
        </div>
        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest hidden sm:block">
           Tiered Modules
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {topics.map((topic, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              {React.cloneElement(topic.icon as React.ReactElement, { size: 18 })}
            </div>
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{topic.level}</span>
            <h3 className="text-sm font-black mt-0.5 mb-4">{topic.title}</h3>
            <ul className="space-y-2">
              {topic.concepts.map((concept, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-white/60 font-medium">
                   <Zap size={8} className="text-emerald-400" />
                   {concept}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
