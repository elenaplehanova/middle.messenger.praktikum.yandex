class LoginAPI extends BaseAPI {
  public request(user: LoginRequest) {
    return authAPIInstance.post<LoginRequest, LoginResponse>('/login', user)
      .then(({user_id}) => user_id); // Обрабатываем получение данных из сервиса далее
  }
}
