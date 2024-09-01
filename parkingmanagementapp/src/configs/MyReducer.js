import cookie from "react-cookies";

export const MyUserReducer = (current, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            cookie.remove("access-token");
            cookie.remove("user");
            return null;
    }
    return current;
}