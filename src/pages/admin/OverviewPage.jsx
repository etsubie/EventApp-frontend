import {  ShoppingBag, User, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import UserGrowthChart from "../../components/users/UserGrowthChart";

const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Users"
            icon={User}
            value="12,345"
            color="#6366F1"
          />
          <StatCard
            name="Total Sales"
            icon={Zap}
            value="$12,345"
            color="#6366F1"
          />
          <StatCard
            name="Total Events"
            icon={ShoppingBag}
            value="1,234"
            color="#8B55F6"
          />
          <StatCard
            name="Total Booking"
            icon={ShoppingBag}
            value="567"
            color="#228822"
          />
        </motion.div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserGrowthChart />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
