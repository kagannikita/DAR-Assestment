import { Component } from '../rendering/Component';
import { ILogin, IRegister, UserAPI } from '../api/UserAPI';

export class LoginForm extends Component {
  template(): string {
    return `<div ref="form" class='login_form hidden'>
         <div class="button-box">
         <div ref="switch" id="btn"></div>
         <button type="button" ref="switchLogin" class="toggle-btn">Login</button>
         <button type="button" ref="switchRegister" class="toggle-btn">Register</button>
      </div>
      <div class="input-group" id="login" ref='loginForm'>
      <input ref="loginUser" type="text" class="input-field" placeholder="Username">
      <input ref="loginPassword" type="password" class="input-field" placeholder="Password">
      <button ref="login" class="submit-btn">Login</button>
         </div>
       <div class="input-group" id="register"  ref="registerForm">
      <input ref="registerUser" type="text" class="input-field" placeholder="Username">
      <input ref="registerPassword" type="password" class="input-field" placeholder="Password">
      <input ref="registerPassword2" type="password" class="input-field" placeholder="Repeat Password">
      <button ref="register" class="submit-btn">Register</button>
         </div>
         </div>`;
  }

  validateLoginFields(login:string, password:string):boolean {
    return login !== '' && password !== '';
  }

  validateRegisterFields(login:string, password:string, password2:string):boolean {
    return login !== '' && password !== '' && password2 !== '';
  }

  init(): void {
    const userAPI = new UserAPI();
    this.refs.switchRegister.onclick = () => {
      this.refs.loginForm.style.left = '-400px';
      this.refs.registerForm.style.left = '50px';
      this.refs.switch.style.left = '110px';
      this.refs.switch.style.width = '180px';
    };

    this.refs.switchLogin.onclick = () => {
      this.refs.loginForm.style.left = '50px';
      this.refs.registerForm.style.left = '450px';
      this.refs.switch.style.left = '0px';
      this.refs.switch.style.width = '110px';
    };
    this.refs.login.onclick = async () => {
      const login = this.refs.loginUser as HTMLInputElement;
      const password = this.refs.loginPassword as HTMLInputElement;
      const record: ILogin = {
        username: login.value,
        password: password.value,
      };
      if (!this.validateLoginFields(login.value, password.value)) {
        alert('Заполните поля логин и пароль');
      } else {
        const response = await userAPI.login(record);
        if (response === 200) {
          document.querySelector('.login_form')!.classList.add('hidden');
          (document.querySelector('.subject') as HTMLElement).classList.remove('show');
          window.location.hash = '#admin/#category';
        }
      }
    };

    this.refs.register.onclick = async () => {
      const login = this.refs.registerUser as HTMLInputElement;
      const password = this.refs.registerPassword as HTMLInputElement;
      const password1 = this.refs.registerPassword2 as HTMLInputElement;
      const record: IRegister = {
        username: login.value,
        password: password.value,
        password2: password1.value,
      };
      if (!this.validateRegisterFields(login.value, password.value, password1.value)) {
        alert('Заполните поля логин и пароль и повторный пароль должен соответствовать второму паролю');
      } else {
        await userAPI.register(record);
      }
    };
  }
}
