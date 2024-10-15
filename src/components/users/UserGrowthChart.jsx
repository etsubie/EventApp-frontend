import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { fetchUserGrowthData } from "../../api/users";

const UserGrowthChart = () => {
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const getUserGrowthData = async () => {
            try {
                setLoading(true);
                const data = await fetchUserGrowthData();
                setUserGrowthData(data);
                setError(null); // Clear error if fetch is successful
            } catch (error) {
                setError(error.message); // Set error message
            } finally {
                setLoading(false);
            }
        };

        getUserGrowthData();
    }, []);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>User Growth</h2>

            {loading ? (
                <div className="text-gray-400">Loading...</div>
            ) : error ? ( // Display error message if there's an error
                <div className="text-red-500">{error}</div>
            ) : (
                <div className='h-[320px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                            <XAxis dataKey='month' stroke='#9CA3AF' />
                            <YAxis stroke='#9CA3AF' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                                    borderColor: "#4B5563",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                            />
                            <Line
                                type='monotone'
                                dataKey='users'
                                stroke='#8B5CF6'
                                strokeWidth={2}
                                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
};

export default UserGrowthChart;
