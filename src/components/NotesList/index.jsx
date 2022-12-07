import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import NoteItem from "../NoteItem";
import { EmptyState } from "../UI/";
import { pageMotion } from "../../constant/animate";

const NotesList = ({ data }) => {
  return (
    <>
      {data.length >= 0 && (
        <motion.ul
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageMotion}
          className="flex flex-row flex-wrap pt-10"
        >
          {data.map((item) => (
            <li key={item.id} className="w-full md:w-6/12 xl:w-4/12 mb-5 pr-2">
              <NoteItem key={item.id} {...item} />
            </li>
          ))}
        </motion.ul>
      )}
      {data.length === 0 && <EmptyState />}
    </>
  );
};

NotesList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NotesList;