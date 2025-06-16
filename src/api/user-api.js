class UserAPI extends BaseAPI {
    create() {
        return api.post('/', {})
            // И то, только в случае, если уверены в результате,
            // иначе контроллер проверит все сам дальше
            .then({user: {info}} => info);
    }
}
