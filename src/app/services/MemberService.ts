import axios from "axios";
import { serverApi } from "../../lib/config";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../../lib/types/member";

class MemberService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async getTopUsers(): Promise<Member[]> {
        try {
            const url = this.path + "/member/top-users";
            const result = await axios.get(url);
            return this.normalizeMembers(result.data);
        } catch (err) {
            throw err;
        }
    }

    private normalizeMembers(data: unknown): Member[] {
        if (Array.isArray(data)) return data;

        if (data && typeof data === "object") {
            const response = data as {
                data?: unknown;
                members?: unknown;
                users?: unknown;
                topUsers?: unknown;
                list?: unknown;
            };

            if (Array.isArray(response.data)) return response.data;
            if (Array.isArray(response.members)) return response.members;
            if (Array.isArray(response.users)) return response.users;
            if (Array.isArray(response.topUsers)) return response.topUsers;
            if (Array.isArray(response.list)) return response.list;

            if (response.data && typeof response.data === "object") {
                const nested = response.data as {
                    members?: unknown;
                    users?: unknown;
                    topUsers?: unknown;
                    list?: unknown;
                };

                if (Array.isArray(nested.members)) return nested.members;
                if (Array.isArray(nested.users)) return nested.users;
                if (Array.isArray(nested.topUsers)) return nested.topUsers;
                if (Array.isArray(nested.list)) return nested.list;
            }
        }

        return [];
    }

    public async getRestaurant(): Promise<Member> {
        try {
            const url = this.path + "/member/restaurant";
            const result = await axios.get(url);
            const restaurant: Member = result.data;
            return restaurant;
        } catch (err) {
            throw err;
        }
    }

    public async signup(input: MemberInput): Promise<Member> {
        try {
            const url = this.path + "/member/signup";
            const result = await axios.post(url, input, { withCredentials: true });

            const member: Member = result.data.member;
            localStorage.setItem("memberData", JSON.stringify(member));

            return member;
        } catch (err) {
            throw err;
        }
    }

    public async login(input: LoginInput): Promise<Member> {
        try {
            const url = this.path + "/member/login";
            const result = await axios.post(url, input, { withCredentials: true });

            const member: Member = result.data.member;
            localStorage.setItem("memberData", JSON.stringify(member));

            return member;
        } catch (err) {
            throw err;
        }
    }

    public async logout(): Promise<void> {
        // If there is no local session, skip the server call entirely so we
        // don't trigger a noisy 401 on a user that's already logged out.
        if (!localStorage.getItem("memberData")) {
            return;
        }
        try {
            const url = this.path + "/member/logout";
            await axios.post(url, {}, { withCredentials: true });
        } catch (err) {
            // A 401 here just means the session already expired server-side.
            if (!(axios.isAxiosError(err) && err.response?.status === 401)) {
                console.warn("Error, logout: ", err);
            }
        } finally {
            localStorage.removeItem("memberData");
        }
    }

    public async updateMember(input: MemberUpdateInput): Promise<Member> {
        try {
            const formData = new FormData();
            formData.append("memberNick", input.memberNick || "");
            formData.append("memberPhone", input.memberPhone || "");
            formData.append("memberAddress", input.memberAddress || "");
            formData.append("memberDesc", input.memberDesc || "");
            formData.append("memberImage", input.memberImage || "");

            const result = await axios(`${serverApi}/member/update`, {
                method: "POST",
                data: formData,
                withCredentials: true,
                headers: {
                    "Content-Type": "multiple/form-data",
                },
            });

            const member: Member = result.data;
            localStorage.setItem("memberData", JSON.stringify(member));
            return member;
        } catch (err) {
            throw err;
        }
    }

}

export default MemberService;
