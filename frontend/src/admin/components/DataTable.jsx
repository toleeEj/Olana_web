import { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, Filter, Download } from 'lucide-react';

export default function DataTable({ endpoint, columns, onEdit, onDelete }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`${endpoint}?page=${page}&search=${search}`);
      setData(res.data.results);
      setTotalPages(Math.ceil(res.data.count / itemsPerPage));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5B6E6B]" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#1B4D3E]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent transition-all text-[#1B4D3E] placeholder-[#5B6E6B]/50"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#1B4D3E]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-[#1B4D3E] to-[#2E6B52]">
                {columns.map((col, index) => (
                  <th
                    key={col.key || index}
                    className="px-6 py-4 text-left text-sm font-semibold text-white first:rounded-tl-2xl last:rounded-tr-2xl"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold text-white rounded-tr-2xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B4D3E]/10">
              {loading ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <div className="h-4 bg-[#F0F4F3] rounded w-3/4"></div>
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 bg-[#F0F4F3] rounded"></div>
                        <div className="h-8 w-8 bg-[#F0F4F3] rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Search size={40} className="text-[#7ABF8E] opacity-30" />
                      <p className="text-[#5B6E6B]">No records found</p>
                      <button
                        onClick={() => setSearch('')}
                        className="text-sm text-[#1B4D3E] hover:text-[#2E6B52] underline"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F8FAF5] transition-colors group"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key || colIndex}
                        className="px-6 py-4 text-sm text-[#1B4D3E]"
                      >
                        <div className="flex items-center gap-2">
                          {col.render ? col.render(item) : item[col.key]}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-[#1B4D3E] hover:bg-[#7ABF8E] hover:text-white rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-[#E8A87A] hover:bg-[#E8A87A] hover:text-white rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Info */}
        {data.length > 0 && (
          <div className="px-6 py-4 bg-[#F8FAF5] border-t border-[#1B4D3E]/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#5B6E6B]">
                Showing <span className="font-medium text-[#1B4D3E]">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium text-[#1B4D3E]">
                  {Math.min(page * itemsPerPage, data.length)}
                </span>{' '}
                of <span className="font-medium text-[#1B4D3E]">{totalPages * itemsPerPage}</span> results
              </p>

              {/* Enhanced Pagination */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                    page === 1
                      ? 'bg-gray-100 text-[#5B6E6B] cursor-not-allowed'
                      : 'bg-white border border-[#1B4D3E]/20 text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white hover:border-transparent'
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm font-medium">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-[#1B4D3E] to-[#2E6B52] text-white shadow-md'
                            : 'text-[#1B4D3E] hover:bg-[#F8FAF5] border border-transparent hover:border-[#7ABF8E]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                    page === totalPages
                      ? 'bg-gray-100 text-[#5B6E6B] cursor-not-allowed'
                      : 'bg-white border border-[#1B4D3E]/20 text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white hover:border-transparent'
                  }`}
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Bar (Optional Enhancement) */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#1B4D3E]/10">
            <p className="text-sm text-[#5B6E6B]">Total Records</p>
            <p className="text-xl font-bold text-[#1B4D3E]">{totalPages * itemsPerPage}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#1B4D3E]/10">
            <p className="text-sm text-[#5B6E6B]">Current Page</p>
            <p className="text-xl font-bold text-[#1B4D3E]">{page} of {totalPages}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#1B4D3E]/10">
            <p className="text-sm text-[#5B6E6B]">Showing</p>
            <p className="text-xl font-bold text-[#1B4D3E]">{data.length} items</p>
          </div>
        </div>
      )}
    </div>
  );
}