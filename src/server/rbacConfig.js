import RBAC from 'easy-rbac';
const rbac = new RBAC({
  operationManager: {
    //role name
    can: [
      //allowed operation
      "/history",
      "/form",
      "/form/dispatchDetails",
      "/api/company/*"
    ]
  },
  admin: {
    can: ["/dashboard", "/notifications*", "/history",
      {
        name: "/history*",
        when: async (params) => {
          var pattern = /^\/history\?_?[a-zA-Z]+=\w+$/
          return pattern.test(params)
        }
      }],
    inherits: ["operationManager"]
  }
});
export default rbac;
