import React from "react";
import Anime from "../components/common/Anime";
import Categories from "../components/common/Categories";

const Home = () => {

  return (
    <div className="flex flex-col gap-32">
      <Anime  />
      <Categories  />
    </div>
  );
};

export default Home;
