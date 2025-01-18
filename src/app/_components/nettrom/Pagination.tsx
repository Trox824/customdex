import ReactPaginate, { ReactPaginateProps } from "react-paginate";

export default function Pagination(props: ReactPaginateProps) {
  if (!props.pageCount || props.pageCount <= 1) return <></>;
  return (
    <div className="my-8 flex justify-center">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <span className="flex items-center px-2">
            Next <span className="ml-1">→</span>
          </span>
        }
        previousLabel={
          <span className="flex items-center px-2">
            <span className="mr-1">←</span> Prev
          </span>
        }
        pageRangeDisplayed={3}
        renderOnZeroPageCount={null}
        marginPagesDisplayed={1}
        containerClassName="flex items-center gap-2"
        pageClassName="pagination-item"
        pageLinkClassName="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        activeClassName="!bg-gray-300 text-white hover:!bg-blue-400 rounded-full"
        previousClassName="pagination-nav"
        nextClassName="pagination-nav"
        breakClassName="flex items-center justify-center w-10 h-10"
        disabledClassName="opacity-50 cursor-not-allowed"
        {...props}
      />
    </div>
  );
}
