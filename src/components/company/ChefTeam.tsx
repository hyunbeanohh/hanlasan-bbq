import { CHEF } from '@/data/company';

const TEAM_MEMBERS = [
  {
    id: 'chef-main',
    name: CHEF.name,
    role: CHEF.role,
    emoji: '👨‍🍳',
  },
  {
    id: 'chef-assist',
    name: '박제주 셰프',
    role: '그릴 전문 부셰프',
    emoji: '🔥',
  },
  {
    id: 'chef-service',
    name: '이한울 매니저',
    role: '행사 코디네이터',
    emoji: '🌿',
  },
];

export default function ChefTeam() {
  return (
    <section className="py-20 md:py-24 bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            OUR TEAM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            전문 셰프 팀
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-border-strong transition-colors text-center"
            >
              {/* Photo placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-surface-3 via-surface-2 to-surface flex flex-col items-center justify-center gap-2">
                <span className="text-6xl" aria-hidden="true">{member.emoji}</span>
                <p className="text-fg-muted text-xs">사진 준비중</p>
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-fg text-lg mb-1">{member.name}</h3>
                <p className="text-fg-muted text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
