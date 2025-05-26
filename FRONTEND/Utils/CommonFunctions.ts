
export const ConvertDate = (data: string) => {
  const date = new Date(data);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  const formatted = date.toLocaleString('en-US', options);
  return formatted;
};



export const getChatTime = (timestamp ) => {

  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedTime
}







export const getFinalHtml = (htmlCode: string, background: string, signatureId: string) => {

  // const closingTableIndex = htmlCode.lastIndexOf('</table>');
  // if (closingTableIndex !== -1) {
  //   htmlCode = `
  //         ${htmlCode.slice(0, closingTableIndex)}
  //         <tr>
  //             <td>
  //                 <img 
  //                     src=${`${Config.base_url}signature/view/${signatureId}?trackId=${trackingId}&t=${Date.now()}&userId=${userDetails?._id}`} 
  //                     width="1" 
  //                     height="1" 
  //                     style="width:1px; height:1px; opacity:0; visibility:hidden;" 
  //                     alt=""
  //                 />
  //             </td>
  //         </tr>
  //         ${htmlCode.slice(closingTableIndex)}
  //     `;
  // }

  return htmlCode;
}


