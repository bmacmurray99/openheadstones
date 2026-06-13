---
title: How to Get Netflix on the Steam Deck
date: 2022-06-01
description: A step-by-step guide to adding Netflix and other streaming services to your Steam Deck using Chrome browser shortcuts.
breadcrumb: Netflix on Steam Deck
image:/posts/adding-netflix-to-steam-deck.webp
---

_While it's pretty baffling that they're not offered on Steam, adding your favorite streaming services to the Steam Deck is a piece of cake._

All modern gaming consoles support streaming video services out of the box, which is why it may come as a surprise to many that Valve decided to buck that trend for its debut handheld. There's a complete lack of native support for streaming apps – no Netflix, no Hulu, no Paramount+, no nothing. It's excellent for what Valve designed it for, but setting up streaming apps on a new device is usually the first thing that someone does. So what gives? Why can't I get Netflix on the Steam Deck?

## Is the Steam Deck Good For Streaming?

There are a few reasons why the Steam Deck doesn't come with Netflix or other streaming services. The Steam Deck is first and foremost a mobile gaming machine, which means it might not be ideal for watching video content. With a 7-inch 720p display, in a slightly unusual 16:10 aspect ratio, it's not going to be a cinema-grade experience. Any video playing on it without a little tweaking is going to look slightly stretched-out and blurry.

You can forget about 60 fps video too – there aren't any streaming services that support that frame rate at the Steam Deck's max resolution. Overall, it's okay as a streaming device in a pinch, but you'll enjoy better picture quality (and battery life) on your phone.

## Why Isn't Netflix Available in the Steam Deck Store?

The Steam Deck comes out of the box with a Linux operating system, which is amazing if you like to tinker with your computers, but it's also pretty niche – as of 2022, Linux made up about 3% of all installed desktop operating systems. Streaming services like Netflix simply don't develop apps for Linux because of the small market share. As a result, there isn't a native Netflix app, nor is there a native Steam Deck app for Hulu, Disney+, or Amazon Prime Video. However, it's very easy to add Netflix and other streaming services to the Steam Deck by adding desktop shortcuts as Non-Steam apps in your Steam Library. You'll need to get into desktop mode, but it's very straightforward, even without Linux experience – no interacting with the terminal at all!

## How to Get Netflix on Steam Deck

![Netflix and Hulu Installed On Steam Deck](/posts/adding-netflix-to-steam-deck-steamos-screenshot.jpg)

### Get Into Desktop Mode

The first step is to boot your Steam Deck into Desktop mode. Either hold down the power button on the top edge of the device, or navigate to the menu option by pressing the Steam button and selecting "Power". Either way you do it, the option to switch to desktop mode should appear on your device's screen. You may want to connect your Deck to a mouse, keyboard, or external monitor, but this can be done without any accessories.

### Install Chrome

_Note: This step is optional if you've already installed Chrome as a Non-Steam App._

Once you're in the desktop, click on the blue shopping bag icon in the taskbar. That's the "Discover App Store". Search for Google Chrome and download the latest stable release. You can also launch it through the app store or by clicking on the Steam Deck icon in the lower left – Chrome can be found under the "Internet" sub menu.

![Installing Chrome on Steam Deck](/posts/adding-netflix-to-steam-deck-install-google-chrome.png)

### Create a Desktop Shortcut

Once you're on the desktop, right click on the desktop and hover over "Create New". You should see an option entitled "Link to Application". Click that and you should see a dialog box come up. Replace "Link to Application" with "Netflix". Then click on the tab labeled "Application", change the Name from "Link to Application" to "Netflix" and paste the following into the "Command" field:

```
flatpak run com.google.Chrome --window-size=1024,640 --force-device-scale-factor=1.25 --device-scale-factor=1.25 --kiosk https://www.netflix.com
```


…Okay, so I lied about not touching the terminal, but you're not touching the terminal _directly._ This is a command that tells the Chrome browser to open Netflix.com in full screen, with the best resolution and scaling available for the Steam Deck. Once you're done, click "OK".

![Creating A Shortcut in SteamOS Desktop Mode](/posts/adding-netflix-to-steam-deck-desktop-shortcut-example-768x480.png)

### Add Your Shortcut to Steam

Open Steam in Desktop mode and click "Add a Game" in the bottom-left. In the application selection prompt, click "Browse" and navigate to your Desktop folder – the default directory for this is `/home/deck/Desktop`. You should be able to see "Netflix.desktop" as a file. Once you select it and it's added to the list of applications to add in the prompt, click "Add game". Once it's added, you can also add art for it by right-clicking the new Netflix app in Steam and selecting "Manage" and then "Set Custom Artwork".

Once you've finished this step, you may want to take a second and log into Netflix in the Chrome browser – that way you won't need to do so the first time you launch it.

### Return to Gaming Mode

Re-boot back into the main Steam Deck UI by clicking "Return to Gaming Mode". If you've installed the application correctly, it should appear in your "recent games" queue.

### Add a Controller Config

Select your new Netflix app in your "Recent Games" queue and then select the controller icon on the right of the screen – this takes you to the controller configuration – at the top you can choose from a few pre-set controller config templates. Select the "Web Browser" template that's available.

### Enjoy!

Congratulations! You've just made your Deck a lean, mean, streaming machine that launches from Steam. You can also employ this approach to add Hulu, Disney+, Amazon Prime Video, and other streaming services to the Steam Deck this way by repeating these steps with the correct service name and service URL respectively (e.g. "Hulu" and `https://www.hulu.com`).
