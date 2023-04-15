export let dict = new Map<string, string>();

dict.set("cesspool.manage_cesspool", "Spravovať žumpy");
dict.set("account.manage_account", "Spravovať uživateľov");
dict.set("location.manage_city", "Spravovať mestá");

dict.set("cesspool.related_to_cesspool", "Pridelený ku žumpe");

dict.set("location.export_data", "Stiahnuť data z mesta");
dict.set("location.be_city_admin", "Pracovnik mesta");

dict.set("client", "Klient");
dict.set("city_admin", "Admin mesta");
dict.set("admin", "Admin");


export default function translate(value: string): string {
    const output = dict.get(value);
    return output ? output : value;
}