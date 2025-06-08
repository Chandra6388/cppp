import Swal from 'sweetalert2';


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
