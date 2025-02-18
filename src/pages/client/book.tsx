import BookDetails from "@/components/client/book/book.details";
import { getBookByIdAPI } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const BookPage = () => {
    let { id } = useParams();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);
    const { message } = App.useApp();
    
    useEffect(() => {
        if (id) {
            const fetBookById = async () => {
                setIsLoadingBook(true);
                const response = await getBookByIdAPI(id);
                if (response && response.data) {
                    setCurrentBook(response.data);
                } else {
                    message.error("Get book by id failed");
                }
                setIsLoadingBook(false);
            }
            fetBookById();
        }
    }, [id])

    return (
        <>
            {isLoadingBook ?
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <FadeLoader
                        color="#243ae5"
                    />
                </div>
                :
                <BookDetails
                    currentBook={currentBook}
                />
            }
        </>
    )
};

export default BookPage;