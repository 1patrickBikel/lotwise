# One-Click Warehouse Demo

## Start the demo

Double-click `Launch Lotwise Demo.command` and keep the Terminal window open. The launcher opens Lotwise on the Mac and prints the same-Wi-Fi phone address.

If macOS asks whether Terminal may accept incoming network connections, allow it for this trusted local warehouse network.

## Phone access

- Remote-desktop app: connect to this Mac and use Lotwise exactly as if you were sitting at it.
- Direct phone browser: connect the phone and Mac to the same Wi-Fi, then enter the `http://<Mac local IP>:5173` address printed by the launcher.
- The launcher uses port `4173`. Its `127.0.0.1` address works only on the Mac itself.
- Access from outside the warehouse network requires a secure VPN or authenticated tunnel. Do not open router port 4173 directly to the public internet.

## Before leaving for the warehouse

1. Double-click the launcher.
2. Refresh the dashboard once.
3. Open **Warehouse checklist** and confirm marks persist after a refresh.
4. Export a JSON backup.
5. Bring the Mac charger and phone charger.
6. Keep the Terminal launcher window open.

## Data warning

This demo stores data in the current browser profile. Do not clear browser data. Export JSON during and after the warehouse session.
