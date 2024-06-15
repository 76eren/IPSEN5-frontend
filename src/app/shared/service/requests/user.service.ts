import {Injectable} from "@angular/core";
import {ApiResponse, ApiService} from "../api.service";
import {ToastrService} from "ngx-toastr";
import {User} from "../../model/user.model";
import { z } from 'zod';
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Role} from "../../model/role";

// The schema for the response data
const RoleSchema = z.enum(['USER', 'ADMIN']);
const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    role: RoleSchema,
    phoneNumber: z.string()
});
const UsersResponseSchema = z.object({
    payload: z.array(UserSchema),
    message: z.string().nullable()
});


@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private apiService: ApiService, private toastr: ToastrService) {
    }


    public getAllUsers(): Observable<User[]> {
        let endpoint = '/user';

        return this.apiService.get<{ payload: User[]; message: string | null }>(endpoint)
            .pipe(
                map(response => {
                    const parsed = UsersResponseSchema.parse(response);
                    return parsed.payload.map(user => new User(
                        user.email,
                        user.lastname,
                        user.firstname,
                        user.phoneNumber,
                        Role[user.role as keyof typeof Role],
                        user.id
                    ));
                }),
                catchError(error => {

                    return [];
                })
            );
    }

    public getCurrentSignedInUser(): Observable<ApiResponse<User>> {
        return this.apiService.get<ApiResponse<User>>('/user/me').pipe(
          catchError((error) => {
            console.error('Error fetching standard location: ', error);
            throw error;
          })
        );
      }

}
