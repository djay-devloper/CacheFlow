import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuChartNoAxesCombined,
    LuSparkles,
} from 'react-icons/lu';
import { HiLogout } from 'react-icons/hi';

export const SideMenuData = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "04",
        label: "Reports",
        icon: LuChartNoAxesCombined,
        path: "/reports",
    },
    {
        id: "05",
        label: "AI Copilot",
        icon: LuSparkles,
        path: "/copilot",
    },
    {
        id: "06",
        label: "Logout",
        icon: HiLogout,
        path: "/logout",
    },
];
