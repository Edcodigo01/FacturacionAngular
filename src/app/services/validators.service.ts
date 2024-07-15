import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  constructor() {}

  float(control: FormControl) {
    if (control?.value) {
      let url = control.value;
      var regExp = /^[0-9]+(\,[0-9]{1,20})?$/;
      if (url.match(regExp)) {
        return true;
      } else {
        return { float: true };
      }
    }
    return {
      only_letters_numbers_underscore: true,
    };
  }
  
  only_letters_numbers_underscore(control: FormControl) {
    if (control?.value) {
      let url = control.value;
      var regExp = /^[a-zA-Z0-9ZñÑáéíóúÁÉÍÓÚ_]*$/;
      if (url.match(regExp)) {
        return true;
      } else {
        return { only_letters_numbers_underscore: true };
      }
    }
    return {
      only_letters_numbers_underscore: true,
    };
  }

  email(control: FormControl) {
    if (!control?.value) {
      return true;
    }

    let url = control.value;
    var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (url.match(regExp)) {
      return true;
    }

    return {
      email: true,
    };
  }

  date(control: FormControl) {
    if (control?.value) {
      let url = control.value;
      var regExp =
        /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
      if (url.match(regExp)) {
        return true;
      }
    }
    return {
      date: true,
    };
  }

  number(control: FormControl) {
    if (control?.value || control.value == 0) {
      let value = control.value;
      var regExp = /^[0-9]+(\.?[0-9]+)?$/;
      if (value.toString().match(regExp)) {
        return true;
      }
    }
    return {
      number: true,
    };
  }

  max(control: any,value:any){
    console.log(value);
    
  }

  onlyNumber(control: FormControl) {
    if (!control?.value) {
      return true;
    }
    if (control?.value) {
      let value = control.value;
      var regExp = /^[0-9]+$/;
      if (value.toString().match(regExp)) {
        return true;
      }
    }
    return {
      onlyNumber: true,
    };
  }

  integer(control: FormControl) {
    if (!control?.value) {
      return true;
    }
    if (control?.value) {
      let value = control.value;
      var regExp = /^[0-9]+$/;
      if (value.toString().match(regExp)) {
        return true;
      }
    }
    return {
      integer: true,
    };
  }

  // minLenght(control: FormControl) {
  //   if (control?.value) {
  //     let value = control.value;

  //     if (value.lenght < 5) {
  //       return true;
  //     }
  //   }
  //   return {
  //     minLenght: true,
  //   };
  // }

  cityRequired(frm: FormGroup) {
    if (frm.controls['citiesCount'].value != 0) {
      if (
        frm.controls['city_id'].value == '' ||
        frm.controls['city_id'].value == null
      ) {
        return { cityRequired: true };
      }
      return;
    } else {
      return;
    }
  }

  urlYoutube(control: any) {
    // if (control?.value) {
    //   let url = control.value;
    //   var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    //   if (url.match(regExp)) {
    //     return true;
    //   }
    // }
    // return {
    //   urlyoutube: true
    // };
  }

  // guarda mensajes de error del servidor en el form

  // muestra mensajes error input
  sow_message(form: FormGroup, name: any) {
    let campo: any = form.get(name);
    if (campo) {
      if (campo.touched && campo.status == 'INVALID') {
        let err = this.message_error(campo.errors);
        return { valid: true, error: err };
      }
    }
    return { valid: false, error: '' };
  }

  // selecciona el mensaje de error a mostrar en input
  message_error(error: any) {
    if (error?.required) {
      return 'Este campo es requerido.';
    } else if (error?.boolean) {
      return 'Este campo debe ser verdadero o falso.';
    } else if (error?.file) {
      return 'Este campo debe ser un archivo.';
    } else if (error?.image) {
      return 'Este campo debe ser una imagen.';
    } else if (error?.min) {
      return 'Este campo debe tener un valor mínimo de: ' + error.min.min;
    } else if (error?.max) {
      return 'Este campo debe tener un valor máximo de: ' + error.max.max;
    } else if (error?.maxlength) {
      return (
        'Este campo debe tener una longitud máxima de: ' +
        error.maxlength.requiredLength
      );
    } else if (error?.minlength) {
      return (
        'Este campo debe tener al menos: ' +
        error?.minlength.requiredLength +
        ' caracateres.'
      );
    } else if (error?.number) {
      return 'Este campo debe ser un número.';
    } else if (error?.onlyNumber) {
      return 'Este campo debe tener solo números.';
    } else if (error?.integer) {
      return 'Este campo debe ser un número entero.';
    } else if (error?.email) {
      return 'La dirección de correo es invalida.';
    } else if (error?.urlyoutube) {
      return 'La dirección url de Youtube es incorrecta.';
    } else if (error?.whitespace) {
      return 'Este campo no debe incluir espacios.';
    } else if (error?.only_letters_numbers_underscore) {
      return 'Este campo debe incluir solo letras, números y guion bajo.';
    } else if (error?.validatePhoneNumber) {
      return 'Formato de número inválido para este campo.';
    } else if (error?.float) {
      return 'Solo números enteros o decimales (,) para este campo.';
    } else if (error?.no_encontrado) {
      return 'No se encontraron resultados.';
      
    } else {
      return error.firstError;
    }
  }

  remove_errors_server(form: FormGroup) {
    for (let name in form.controls) {
      let campo = form.get(name);
      if (campo && campo?.errors && campo.hasError('firstError')) {
        delete campo.errors['firstError'];
        campo.updateValueAndValidity();
      }
    }
  }

  detect_errors_server(response: any, form: FormGroup) {
    if (response?.error && response?.error.errors) {
      let errors = response.error.errors;
      for (let name in errors) {
        let err = errors[name];
        let campo: any = form.get(name);
        if (campo) {
          campo.setErrors({ firstError: err });
        }
      }
      return true;
    } else {
      return;
    }
  }
}
