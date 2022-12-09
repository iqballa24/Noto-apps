import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar, EmptyState, Spinner } from "../components/UI";
import NotesList from "../components/NotesList";
import WrapperPages from "../components/WrapperPages";
import ThemeContext from "../store/theme-context";
import useFetch from "../hooks/useFetch";

const ActiveNotes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getNotes, deleteNote, archiveNote } = useFetch();
  const { data, mutate, loading: loadingNotes } = getNotes("/notes");
  const { currentLanguage } = useContext(ThemeContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const params = searchParams.get("search");
  const [keyword, setKeyword] = useState(() => params || "");

  const searchHandler = (e) => {
    const search = e.target.value;
    setKeyword(search);
    setSearchParams({ search });
  };

  const filteredNotes =
    data?.data.filter((note) =>
      note.title.toLowerCase().includes(keyword.toLowerCase())
    ) ?? [];

  const searchNotFound =
    currentLanguage === "en" ? (
      <p className="text-center">
        Notes with the title <em>"{keyword}"</em> not found
      </p>
    ) : (
      <p className="text-center">
        Catatan dengan judul <em>"{keyword}"</em> tidak ditemukan
      </p>
    );

  async function deleteHandler(id) {
    setIsLoading(true);
    try {
      const { data, error } = await deleteNote(id);

      if (error) {
        throw Error(data);
      }
      mutate();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function archiveNoteHandler(id) {
    setIsLoading(true);
    try {
      const { data, error } = await archiveNote(id);

      if (error) {
        throw Error(data);
      }
      mutate();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <WrapperPages
      titlePage={currentLanguage === "en" ? "Active Notes" : "Catatan Aktif"}
    >
      <section className="flex flex-col py-5">
        <SearchBar onSearchHandler={searchHandler} value={keyword} />
        <NotesList
          data={filteredNotes}
          onDelete={deleteHandler}
          onArchive={archiveNoteHandler}
        />
        {filteredNotes.length === 0 && data?.data.length > 0 && searchNotFound}
        {data?.data.length === 0 && <EmptyState />}
        {loadingNotes && <Spinner />}
        {isLoading && <Spinner />}
      </section>
    </WrapperPages>
  );
};

export default ActiveNotes;
