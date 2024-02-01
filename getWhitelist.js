/**
 * Whitelist Address Exporter
 *
 * This script connects to your Supabase database and exports a whitelist of user addresses
 * from the "whitelist" table to a JSON file named "whitelist.json".
 *
 * Usage:
 * 1. Replace "YOUR_SUPABASE_URL" with your actual Supabase URL.
 * 2. Replace "YOUR_SUPABASE_ANON_KEY" with your actual Supabase anonymous key.
 *
 * Instructions:
 * 1. Run the script using the following command:
 *    ```
 *    npm run whitelist
 *    ```
 * 2. The script will connect to your Supabase database, fetch the user addresses, and export them to "whitelist.json" in the same directory.
 * 3. You can now use the generated "whitelist.json" file with the list of addresses.
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const exportUserAddresses = async () => {
  try {
    const { data, error } = await supabase.from("whitelist").select("useraddress");

    if (error) {
      console.error(error);
      return;
    }

    const addresses = data.map((entry) => entry.useraddress).filter(Boolean);

    const jsonContent = JSON.stringify(addresses, null, 2);

    fs.writeFileSync("whitelist.json", jsonContent);
    console.log("User addresses exported to whitelist.json successfully!");
  } catch (error) {
    console.error(error);
  }
};

exportUserAddresses();
