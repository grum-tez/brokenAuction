import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export const items_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("int", []);
export const tokens_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("int", []);
export class items_value implements att.ArchetypeType {
    constructor(public seller: att.Address, public deadline: Date, public topBid: att.Tez, public topBidder: att.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.seller.to_mich(), att.date_to_mich(this.deadline), this.topBid.to_mich(), this.topBidder.to_mich()]);
    }
    equals(v: items_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): items_value {
        return new items_value(att.Address.from_mich((input as att.Mpair).args[0]), att.mich_to_date((input as att.Mpair).args[1]), att.Tez.from_mich((input as att.Mpair).args[2]), att.Address.from_mich((input as att.Mpair).args[3]));
    }
}
export class tokens_value implements att.ArchetypeType {
    constructor(public owner: att.Address, public token_md: string) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.owner.to_mich(), att.string_to_mich(this.token_md)]);
    }
    equals(v: tokens_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): tokens_value {
        return new tokens_value(att.Address.from_mich((input as att.Mpair).args[0]), att.mich_to_string((input as att.Mpair).args[1]));
    }
}
export const items_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%seller"]),
    att.prim_annot_to_mich_type("timestamp", ["%deadline"]),
    att.prim_annot_to_mich_type("mutez", ["%topBid"]),
    att.prim_annot_to_mich_type("address", ["%topBidder"])
], []);
export const tokens_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%owner"]),
    att.prim_annot_to_mich_type("string", ["%token_md"])
], []);
export type items_container = Array<[
    att.Int,
    items_value
]>;
export type tokens_container = Array<[
    att.Int,
    tokens_value
]>;
export const items_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("int", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%seller"]),
    att.prim_annot_to_mich_type("timestamp", ["%deadline"]),
    att.prim_annot_to_mich_type("mutez", ["%topBid"]),
    att.prim_annot_to_mich_type("address", ["%topBidder"])
], []), []);
export const tokens_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("int", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%owner"]),
    att.prim_annot_to_mich_type("string", ["%token_md"])
], []), []);
const mint_arg_to_mich = (m_token_md: string): att.Micheline => {
    return att.string_to_mich(m_token_md);
}
const openAuction_arg_to_mich = (oa_itemID: att.Int, oa_seller: att.Address, oa_deadline: Date): att.Micheline => {
    return att.pair_to_mich([
        oa_itemID.to_mich(),
        oa_seller.to_mich(),
        att.date_to_mich(oa_deadline)
    ]);
}
const bid_arg_to_mich = (b_itemID: att.Int): att.Micheline => {
    return b_itemID.to_mich();
}
const claimTopBid_arg_to_mich = (c_itemID: att.Int): att.Micheline => {
    return c_itemID.to_mich();
}
export class BrokenAuction {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/brokenAuction.arl", {}, params)).address;
        this.address = address;
    }
    async mint(m_token_md: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "mint", mint_arg_to_mich(m_token_md), params);
        }
        throw new Error("Contract not initialised");
    }
    async openAuction(oa_itemID: att.Int, oa_seller: att.Address, oa_deadline: Date, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "openAuction", openAuction_arg_to_mich(oa_itemID, oa_seller, oa_deadline), params);
        }
        throw new Error("Contract not initialised");
    }
    async bid(b_itemID: att.Int, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "bid", bid_arg_to_mich(b_itemID), params);
        }
        throw new Error("Contract not initialised");
    }
    async claimTopBid(c_itemID: att.Int, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "claimTopBid", claimTopBid_arg_to_mich(c_itemID), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_mint_param(m_token_md: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "mint", mint_arg_to_mich(m_token_md), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_openAuction_param(oa_itemID: att.Int, oa_seller: att.Address, oa_deadline: Date, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "openAuction", openAuction_arg_to_mich(oa_itemID, oa_seller, oa_deadline), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_bid_param(b_itemID: att.Int, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "bid", bid_arg_to_mich(b_itemID), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_claimTopBid_param(c_itemID: att.Int, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "claimTopBid", claimTopBid_arg_to_mich(c_itemID), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_next_tokenID(): Promise<att.Int> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Int.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_items(): Promise<items_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[1], (x, y) => [att.Int.from_mich(x), items_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    async get_tokens(): Promise<tokens_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[2], (x, y) => [att.Int.from_mich(x), tokens_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        claimTopBid_r2: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"claimTopBid_r2\"")]),
        claimTopBid_r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"claimTopBid_r1\"")]),
        bid_r2: att.string_to_mich("\"The auction is over\""),
        bid_r1: att.string_to_mich("\"You must bid more than the current top bid\""),
        mint_r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"mint_r1\"")])
    };
}
export const brokenAuction = new BrokenAuction();
