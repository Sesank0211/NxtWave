import { Hammer, Sparkles, FolderGit2 } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  highlights: string[];
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  highlights,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-center text-xs font-medium text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Benefits: React.FC = () => {
  const benefits = [
    {
      title: 'Learn by Building',
      description:
        'Skip abstract theory and jump straight into live implementation. Build a tangible AI application from scratch during the session.',
      icon: <Hammer className="h-6 w-6" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      highlights: ['Interactive coding pace', 'Direct hands-on experience', 'Ready-to-run codebase'],
    },
    {
      title: 'Start Without Prior AI Experience',
      description:
        'No prior machine learning or data science background required. The workshop is structured specifically for beginners starting their journey.',
      icon: <Sparkles className="h-6 w-6" />,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      highlights: ['Beginner-friendly explanations', 'Clear architectural breakdown', 'Zero complex math required'],
    },
    {
      title: 'Develop Practical Project Skills',
      description:
        'Gain real-world engineering skills including API integration, prompt orchestration, and frontend wiring that you can highlight on your portfolio.',
      icon: <FolderGit2 className="h-6 w-6" />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      highlights: ['Portfolio-ready asset', 'GitHub repo structure', 'Resume-boosting technical proof'],
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
            Why Attend
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Practical, Measurable Learning
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to turn your curiosity about artificial intelligence into a working project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
              iconBg={benefit.iconBg}
              iconColor={benefit.iconColor}
              highlights={benefit.highlights}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
