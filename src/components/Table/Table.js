import React from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import './Table.css';

const Table = ({
  headers,
  data,
  renderRow,
  handleDelete,
  handleModify,
  handleThirdAction,
  role,
  ModifyIcon = FaRegEdit,
  DeleteIcon = FaRegTrashCan,
  ThirdIcon,
  showModify = true,
  showDelete = true,
  showThirdAction = false,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white mt-8">
        <thead>
          <tr className="custom-color">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-4 text-xs sm:text-sm text-left sm:text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id} className="text-center">
              {renderRow(item)}
              {role === 'admin' && (
                <td className="py-2 px-4 border-b border-gray-200">
                  <>
                    {showThirdAction && ThirdIcon && handleThirdAction && (
                      <button
                        className="text-blue-500 hover:text-green-700 transition mx-1"
                        onClick={() => handleThirdAction(item)}
                      >
                        <ThirdIcon size={20} />
                      </button>
                    )}
                    {showModify && handleModify && (
                      <button
                        className="text-blue-500 hover:text-blue-700 transition mx-1"
                        onClick={() => handleModify(item)}
                      >
                        <ModifyIcon size={20} />
                      </button>
                    )}
                    {showDelete && handleDelete && (
                      <button
                        className="text-blue-500 hover:text-red-700 transition mx-1"
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteIcon size={20} />
                      </button>
                    )}
                  </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
