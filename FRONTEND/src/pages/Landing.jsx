import { Link } from 'react-router-dom';
import {
  LuArrowRight,
  LuChartNoAxesCombined,
  LuCircleDollarSign,
  LuCreditCard,
  LuShieldCheck,
  LuSparkles,
  LuTrendingUp,
} from 'react-icons/lu';

const features = [
  {
    icon: <LuChartNoAxesCombined className="text-xl" />,
    title: 'See the whole picture',
    description:
      'Bring your income and spending together in one clear, easy-to-read dashboard.',
  },
  {
    icon: <LuCreditCard className="text-xl" />,
    title: 'Stay on top of spending',
    description:
      'Keep everyday expenses organized and spot patterns before they become surprises.',
  },
  {
    icon: <LuTrendingUp className="text-xl" />,
    title: 'Make progress feel simple',
    description:
      'Follow your cash flow over time and make your next money decision with confidence.',
  },
];

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaff] text-slate-900">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5" aria-label="CacheFlow home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <LuCircleDollarSign className="text-2xl" />
          </span>
          <span className="text-xl font-bold tracking-tight">CacheFlow</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main navigation">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 transition hover:text-violet-700"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:px-5"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:px-12 lg:pb-28 lg:pt-16">
        <div className="absolute -left-40 top-24 -z-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-sm sm:text-sm">
            <LuSparkles className="text-base" />
            A calmer way to manage your money
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Make every
            <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text pb-1 text-transparent">
              dollar make sense.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Know what’s coming in, where it’s going, and how you’re doing — all
            in one refreshingly simple place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl"
            >
              Start managing your money
              <LuArrowRight className="text-lg" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
            >
              I already have an account
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <LuShieldCheck className="text-lg text-emerald-600" />
            Your finances, organized in one private space
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-2xl lg:pl-4">
          <div className="absolute -right-7 -top-8 h-32 w-32 rounded-[2rem] bg-fuchsia-200/60 blur-2xl sm:-right-9 sm:-top-10 sm:h-44 sm:w-44" />
          <div className="absolute -bottom-10 -left-6 h-36 w-36 rounded-full bg-violet-200/70 blur-2xl" />
          <div className="relative rounded-[1.6rem] border border-white bg-white p-3 shadow-[0_28px_90px_-32px_rgba(91,58,163,0.3)] sm:rounded-[2rem] sm:p-5">
            <div className="rounded-[1.2rem] bg-[#faf9ff] p-4 sm:rounded-[1.5rem] sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">YOUR OVERVIEW</p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
                    Welcome to your finances
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  CF
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    Total balance
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    $8,420
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Across your accounts</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Income this month
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    $5,240
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-600">
                    Looking good
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:mt-5 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold sm:text-base">Cash flow</h3>
                    <p className="mt-1 text-xs text-slate-500">Your monthly snapshot</p>
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1">
                      <LuTrendingUp />
                      On track
                    </span>
                  </span>
                </div>
                <div className="mt-4 h-32 w-full sm:h-40">
                  <svg
                    viewBox="0 0 520 150"
                    className="h-full w-full"
                    role="img"
                    aria-label="Example cash flow chart trending upward"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".2" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[25, 65, 105, 145].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="520"
                        y1={y}
                        y2={y}
                        stroke="#f1eff7"
                        strokeWidth="1"
                      />
                    ))}
                    <path
                      d="M0 118 C40 110 55 83 95 92 S150 110 190 77 S250 85 290 61 S350 73 390 42 S455 58 520 18 L520 150 L0 150Z"
                      fill="url(#chartFill)"
                    />
                    <path
                      d="M0 118 C40 110 55 83 95 92 S150 110 190 77 S250 85 290 61 S350 73 390 42 S455 58 520 18"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    <circle cx="520" cy="18" r="5" fill="#8b5cf6" />
                  </svg>
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400 sm:text-xs">
                  <span>WEEK 1</span>
                  <span>WEEK 2</span>
                  <span>WEEK 3</span>
                  <span>WEEK 4</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm sm:mt-5 sm:px-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <LuCreditCard className="text-xl" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Everyday spending</p>
                    <p className="text-xs text-slate-500">Keep an eye on the little things</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">This month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white/75">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-3 md:gap-10 lg:px-12 lg:py-16">
          {features.map(({ icon, title, description }) => (
            <article key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                {icon}
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
}

export default Landing;
