Wedding invitation — Mustafa & Falasteen

Files
- index.html: main page, including CSS styling and sharing metadata.
- invite.html: sharing URL copy of the same page.
- invitation.js: envelope opening, grouped text animation, countdown, maps, music.
- assets/: images and audio used by the website.

Run locally
Extract this ZIP. Open the folder in VS Code and use Live Server, or run:
python -m http.server 8000
Then open http://localhost:8000

Editing
Edit CSS inside the <style> element in the HTML files. Update both HTML files together.
The wedding date and Google Maps links are at the top of invitation.js.
Most Arabic wording is embedded in PNG artwork; edit or replace those images to change it.
The five animation groups use a transparent lettering image over a background image.

Hosting and cover preview
Upload these files to any static web host. When changing the domain, update canonical,
og:url, og:image, og:image:secure_url and twitter:image in BOTH HTML files to the new
public HTTPS domain. The cover asset is assets/envelope-share.jpg.
Messaging apps control caching and display of link previews.

Event: 21 November 2026, 6–9 PM, Asia/Amman. Zaffa: 3 PM.
No build step, API keys or npm dependencies are required.
