import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todosApi = createApi({
  reducerPath: "todosApi",
  tagTypes: ["Todos"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/data",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Todos", id: id })),
              { type: "Todos", id: "LIST" },
            ]
          : [{ type: "Todos", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/data/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
    isComplete: builder.mutation({
      query: ({ id, ...isCompletedUser }) => ({
        url: `/data/${id}`,
        method: "PUT",
        body: isCompletedUser,
      }),
      invalidatesTags: ["Todos"],
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/data",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Todos"],
    }),
    editUser: builder.mutation({
      query: (user) => ({
        url: `/data/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Todos"],
    }),
    searchUser: builder.query({
      query: (searchValue) => `/data?q=${searchValue}`
    }),
    selUser: builder.query({
      query: (selValue) => `/data?isComplete=${selValue == "active" ? true : false}`
    })
  }),
});

export const {
  useGetUserQuery,
  useDeleteUserMutation,
  useIsCompleteMutation,
  useAddUserMutation,
  useEditUserMutation,
  useSearchUserQuery,
  useSelUserQuery,
} = todosApi;
