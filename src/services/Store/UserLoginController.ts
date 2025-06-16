// somewhere/in/types/file.ts

interface LoginFormModel {
  email: string;
  password: string;
}

// controllers/user-login.ts

const loginApi = new LoginAPI();
const userLoginValidator = validateLoginFields(validateRules);

class UserLoginController {
  public async login(data: LoginFormModel) {
        try {
            // Запускаем крутилку            

            const validateData = userLoginValidator(data);

            if (!validateData.isCorrect) {
                throw new Error(validateData);
            }
        
            const userID = loginApi.request(prepareDataToRequest(data));

            RouteManagement.go('/chats');

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
    }
  }
}

class UserLoginController {
  @validate(userLoginValidateRules)
  @handleError(handler)
  public async login(data: LoginFormModel) {
    const userID = loginApi.request(prepareDataToRequest(data));
    RouteManagement.go('/chats');
  }
}

// Код стал намного короче, удобнее и его проще читать.
//  Валидатор в декораторе творит свои «дела» и 
// выдаёт ошибку, если что-то не так. Ошибки также обрабатываются с помощью декоратора.
