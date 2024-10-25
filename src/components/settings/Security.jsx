import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import { Link, useParams } from "react-router-dom";

const Security = () => {
	const {id} = useParams()

	return (
		<SettingSection icon={Lock} title={"Security"}>
			<div className='mt-4'>
				<Link to={`/change-password/${id}`}
					className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200
        '
				>
					Change Password
				</Link>
			</div>
		</SettingSection>
	);
};
export default Security;
