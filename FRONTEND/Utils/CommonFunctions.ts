import Swal from 'sweetalert2';
import { format, differenceInMinutes, differenceInHours, parseISO, isValid } from "date-fns";
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

export const getChatTime = (timestamp) => {

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


//  confirmButtonColor: "#01c8a7",
export const sweetAlert = (title: string, text: string, icon: any, timer?: number) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: timer || 2000,
      timerProgressBar: true,
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch((error) => {
      reject(error);
    });
  });
}


// Format date to readable format
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


export const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return "bg-blue-500/20 text-blue-300";
    case 'in-progress':
      return "bg-amber-500/20 text-amber-300";
    case 'resolved':
      return "bg-green-500/20 text-green-300";
    case 'closed':
      return "bg-gray-500/20 text-gray-300";
    default:
      return "bg-blue-500/20 text-blue-300";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return "text-green-400";
    case 'medium':
      return "text-yellow-400";
    case 'high':
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};


export const formatNotificationTime=(isoString: string): string =>{
  if (!isoString) return "";

  const date = parseISO(isoString);
  if (!isValid(date)) return "";

  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);

  if (minutesAgo < 1) {
    return "Just now";
  } else if (minutesAgo < 60) {
    return `${minutesAgo} min ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  } else {
    return format(date, "MMM dd, yyyy");
  }
}

export const base64ToBlob = (base64String: string) => {
  const parts = base64String.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([intArray], { type: mime });
};
