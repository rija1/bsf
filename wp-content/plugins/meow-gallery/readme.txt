=== Meow Gallery ===
Contributors: TigrouMeow
Tags: gallery, masonry, image, block, lightroom
Requires at least: 6.0
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 5.1.9
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Polished, beautiful gallery built for simplicity and speed. Features Gallery Block, shortcode, or overrides standard WordPress gallery. 

== Description ==

Polished and beautiful gallery built for simplicity, appareance and speed. It features a Gallery Block, but you can also use a shortcode or let it override the standard WordPress gallery. It's responsive, retina-friendly, has modern layouts, blazing fast and tightly optimized. If you are interested in seeing the layouts in actions, click here: [Meow Gallery's Layouts](https://meowapps.com/meow-gallery/layouts/).

=== Features ===

Uses WordPress and Gutenberg naturally without hacking it, and more importantly, without imposing its own system and making your website dependent of it. It means you can use the Meow Gallery and one day switch back to the WordPress core rendering, or anything else. It works everywhere, easily, and fits naturally in WordPress. We will never blow it up with features that most users do not need.

[youtube https://youtu.be/ZyboZqZb9JQ]

=== Layouts ===

Shipped with the popular layouts such as Tiles, Masonry, Justified (like Flickr), Square (like Instagram), Cascade. The Pro version contains a few more layouts. Demo [here](https://meowapps.com/meow-gallery/layouts/).

=== Compatibility ===

Since this gallery works with WordPress in a natural way, it should be compatible with any other plugins or themes (of course, it depends on how those have been exactly implemented). The following plugins might interest you.

* Lightbox: The choice of the lightbox is yours, so this gallery does not come with one. However, we made the [Meow Lightbox](https://wordpress.org/plugins/meow-lightbox/). It follows the same principles.
* Lightroom: It fully works with [Photo Engine](https://wordpress.org/plugins/wplr-sync/), its Media Organizer, and its attributes. If you wish to use to control it with Lightroom, this is also easy!
* External Links: If you want to create links from your images to external URLs, we recommend you the [Gallery Custom Links](https://wordpress.org/plugins/gallery-custom-links/) plugin.
* Audio: You can also add sound, music or any kind of audio to an image. To do this, you can use [Audio Story Images](https://wordpress.org/plugins/audio-story-images/).

This plugin is SEO-friendly, so for example, the list of images will be added in your sitemap (Yoast SEO does this).

=== Pro Version ===

If you want to support us, you will get those additional features.

* Infinite/Lazy loading, for a faster page loading and a smoother experience for the user.
* The Carousel / Slider, a very cool and dynamic layout, that can also be used as a Hero.
* The Map Layout, a different and really nice way to present your photos, or trips.
* Animations on your galleries.

You can find more information on this plugin on [Meow Apps: Meow Gallery](https://meowapps.com/meow-gallery/).

Languages: English.

== Changelog ==

= 5.1.9 (2024/08/25) =
* Fix: Fixed link attributes for maps.
* Fix: Removed error logs.
* Note: Meow needs some love! If you have a moment, please write a little [review for the Meow Gallery](https://wordpress.org/support/plugin/meow-gallery/reviews/?rate=5#new-post). Thank you! 💕

= 5.1.8 (2024/08/01) =
* Fix: Make sure data-attr have a layout.
* Fix: Minor issues.

= 5.1.7 (2024/06/15) =
* Update: Code cleaning, libs optimization, etc.
* Fix: Carousel Hero height for non-horizontal images.
* Fix: Resolved issues with the Gallery Manager modal.
* Update: Use Image Alt as Aria Label if there is link attachment by default.

= 5.1.6 (2024/06/05) =
* Add: Hero Mode for Carousel with Latest Posts.
* Add: Re-order feature for Gallery Manager.
* Fix: "Edit" modal functionality in current gallery mode.
* Fix: JS/Picture WebP Rewriting compatibility.
* Fix: Maintained Left to Right layout on Masonry resize.
* Update: Integrated latest NekoUI and common libraries.
* Update: And a few more things here and there.

= 5.1.5 (2024/05/10) =
* Fix: Addressed XSS injection vulnerability via shortcode and updated readme documentation.
* Add: Implemented carousel infinite scroll with lazy loading.
* Update: Enabled Lightbox rendering for lazy-loaded carousel media.
* Update: Prepared gallery rendering within Gutenberg iframe.

= 5.1.3 (2024/04/06) =
* Fix: Order by used in shortcode.

= 5.1.2 (2024/03/16) =
* Add: Hero Carousel for Posts.
* Add: Improved Masonry layout.
* Add: Added support for videos in the Gallery Manager.
* Add: Added a meow attribute to the shortcodes to avoid conflicts with other plugins.
* Fix: Issues related to Infinite Loading, Custom Links and Shortcodes.
* Update: Improve the Media Selector.

= 5.1.1 (2024/01/20) =
* Add: New zoom setting for map layouts and maintenance features including export, import, and reset options.
* Update: Enhanced map functionality with thumbnail selection fix for missing images and corrected src_set values.
* Add: Density labels with image count and captions alignment feature.
* Update: Integrated captions style with WordPress standards and reintroduced resize event for full pages.
* Fix: Issues with collections in WP/LR folders and removed obsolete gallery and collection processes.
* Add: 'mgl_custom_link_classes' filter and collection preview, with collection style moved to pro file.

= 5.1.0 (2023/12/08) =
* Add: Support for collections in the Pro! You can now create collections of galleries, and have them displayed nicely on your pages.
* Add: New option to avoid overring the default WordPress gallery.

= 5.0.9 (2023/11/26)
* Add: Introduced unique IDs for Gallery Manager to enhance functionality
* Add: Initial version of Gallery Manager (Proof of Concept) added.
* Fix: Addressed the issue with missing Leaflet for maps by implementing async loading at mount.
* Update: Changed "Immersive captions" from being the default setting to an optional feature.

= 5.0.7 (2023/11/15) =
* Update: Enhanced Carousel with the addition of a compact design, integrating navigation and captions internally for a more immersive experience.
* Update: Refined Carousel captions style to enhance user immersion and engagement.
* Fix: Resolved CSS typo for improved style consistency.
* Fix: Addressed Carousel and Square component mounting visibility issues, ensuring seamless display across layouts.
* Fix: Corrected nowrap settings for Dots and Thumbnails to enhance navigation.
* Fix: Fixed an issue where carousel captions were not displaying in certain scenarios.
* Fix: Addressed an issue with invisible captions to improve content visibility.
* Fix: Implemented a workaround for initializing map sizes, enhancing layout adaptability.
* Fix: Resolved warning issues in Horizontal layout on mobile devices for better user experience.

= 5.0.6 (2023/10/23) =
* Add: Initial implementation of Thumbnail Navigation for Carousel.
* Add: "Scroll Warning" feature for Horizontal layout.
* Add: "Stylish Style" for the "Tiles" layout.
* Add: Introduced 'mgl_sort_ahead' filter for more flexible infinite loading.
* Update: Improved Carousel behavior with fixes to clone loop handling and clone images in lightbox.
* Update: Enhanced navigation features including dot navigation for large galleries and centering thumbnails.
* Update: Moved Carousel caption above dot navigation for improved visibility.
* Update: Code refinements in Carousel component and corrected overwritten code from previous commit.
* Fix: Addressed issues with "Keep Aspect Ratio" on both mobile and carousel affecting other layouts.
* Fix: Resolved issues with Gallery interfering with other Leaflet maps and improved map centering.
* Fix: Adjusted captions for Horizontal layout and ensured Autoplay functions correctly without arrow navigation.

= 5.0.5 (2023/10/10) =
* Add: Carousel autoplay and better captions.
* Add: Option to keep the images's aspect ratio with Carousel.
* Update: Infinite Scroll now has its own section and loading styles.
* Fix: Display an error message instead of crashing for backtrack limit exhaustion. 

= 5.0.4 (2023/10/28) =
* Fix: Previously generated gallery previews were not showing at all, now handled properly.
* Update: Adjusted infinite scroll images to fit parent div.
* Fix: Initial Map Layout size.

= 5.0.3 (2023/10/19) =
* Update: Back to using the DOM naturally for the images. This will be easier for lightboxes to work with the gallery, and SEO scripts to work with the images.
* Update: Code cleaning, libs optimization, etc.

= 5.0.2 (2023/10/14) =
* Fix: Removed useless data attributes.
* Fix: Images always had links, now it respects the settings.

= 5.0.1 (2023/09/12) =
* Fix: Links from Gallery Custom Links were not supported.
* Fix: Alignment issue (fullwidth, etc).
* Fix: Square Layout was not working with more than 5 columns.
* Fix: Compatibility with PHP 8.4.

= 5.0.0 (2023/09/02) =
* Update: Big rewriting to make the plugin more modern and faster, and allow more features in the future.
* Update: Meow Lightbox and Meow Gallery both need to be version 5.0.0+ to work together.

= 4.3.8 (2023/05/01) =
* Update: Common dashboard.
* Fix: Issues with tiles in the editor.
* Fix: Issues in the carousel.

= 4.3.5 (2023/04/23) =
* Update: Minimal for mobile now means one column.

= 4.3.4 (2023/04/23) =
* Fix: Restore the common dashboard, and lighter bundle.
* Fix: There was an issue with maps, if you were using them.

= 4.3.2 (2023/02/21) =
* Update: New admin, and UI framework.

= 4.3.1 (2023/01/06) =
* Fix: Avoid the E_PARSE error on some PHP versions.

= 4.3.0 (2022/12/28) =
* Fix: Required PHP version was a bit too high.
* Fix: There was useless console.logs  in the code and a useless call in the admin.

= 4.2.9 (2022/11/28) =
* Fix: There was a crash on some versions of PHP (not sure which ones).

= 4.2.8 (2022/11/14) =
* Fix: The right click handling was not implemented.

= 4.2.7 (2022/09/29) =
* Add: Option to set the height buffer for infinite loading. 
* Fix: Load script in the footer instead of header.

= 4.2.6 (2022/07/13) =
* Fix: If the phpinfo() function doesn't exist, avoid calling it.

= 4.2.5 (2022/04/14) =
* Update: jQuery is not needed anymore.
* Add: New filter mgl_ids, to overrides the IDs used.
* Fix: Compatibility with latest Gutenberg (you might need to click on "Repair Block" when editing them again).

= 4.2.4 (2022/02/25) =
* Update: Only load CSS and JS when the gallery is in use.
* Fix: Responsive Images weren't used since January - sorry about that!
* Add: New "Horizontal" layout.
* Fix: Improved touch events.

= 4.2.2 (2021/09/22) =
* Fix: Carousel block issue.
* Update: Common lib 3.6.

= 4.2.1 (2021/09/07) =
* Fix: Preview was not working well with the new security enhancements.

= 4.2.0 (2021/09/02) =
* Fix: Issue with avoidLoneLastItem code in Tiles.
* Fix:  Fix issue with square columns not working.
* Add: Added filters for access control.

= 4.1.9 (2021/08/29) =
* Fix: Enhanced security for the plugin to avoid hackers.

= 4.1.8 (2021/08/27) =
* Info: It seems like the version 4.1.7 version was maybe not pushed properly, so let's have a jump to make sure everyone is up to date.

= 4.1.7 (2021/08/11) =
* Fix: Attributes where escaped a tad too much.

= 4.1.6 (2021/07/31) =
* Fix: SQL Injection and Arbitrary Options Update fixes.

= 4.1.3 (2021/07/06) =
* Fix: Remove double images on map markers.
* Fix: Allow HTML such as links in the gallery items.
* Fix: Fixed double slash in the CSS and JSS urls. 

= 4.1.2 (2021/04/05) =
* Fix: Issue with the options relative to captions.

= 4.1.1 (2021/03/05) =
* Fix: Optimization of the core.

= 4.1.0 (2021/03/02) =
* Fix: Avoid compatibility issue if an old version of the common library is used.

= 4.0.9 (2021/03/01) =
* Fix: Preview issues with default layout.
* Fix: Attempt to fix compatibility with some SEO plugins.
* Fix: Row height calculation.
* Fix: Prevent the avoidLoneLastItem function fail.

= 4.0.8 (2021/02/14) =
* Fix: Users with sufficient roles can now edit blocks.
* Fix: Preview wasn't working fine when set on default.
* Fix: Issue with tiles CSS.

= 4.0.7 (2021/02/11) =
* Fix: Tiles Block in Gutenberg.
* Update: Use Google Maps SDK instead of Leaflet.
* Fix: MacOS Chrome issue with Tiles.
* Fix: Square layout issue.

= 4.0.6 (2021/02/06) =
* Update: New system for tiles.
* Update: Better responsive features (please check the settings).
* Fix: Issue with dots nav.
* Fix: Compatibility with Social Snap.

= 4.0.5 (2020/12/30) =
* Update: New and better admin.
* Update: Brand new carousel with no extra script.

= 4.0.4 (2020/11/20) =
* Add: Right click option.

= 4.0.3 (2020/09/06) =
* Update: Better compatibility with Meow Lightbox.
* Update: Updated the common library.

= 4.0.1 (2020/08/25) =
* Fix: Better loading of the JS and CSS files.
* Fix: Compatibility with WP/LR Sync.
* Update: Repository cleaning.

= 4.0.0 (2020/08/21) =
* Update: New UI in the admin, better and faster architecture.

= 3.5.9 =
* Fix: Remove dots when 3 or fewer images in Carousel.
* Fix: Cascade layout had an issue when vertical image was sandwiched between two horizontal ones.
* Update: With the Gutenberg Block, default should be... default, and not always 'Tiles'.
* Fix: Map doesn't crash anymore on first init in the editor.

= 3.5.8 =
* Fix: When the gallery is empty, automatically gets the images attached to the post.
* Update: Better i18n support for admin.

= 3.5.7 =
* Fix: Avoid an issue (when a gallery had an issue, all the other galleries weren't rendered).
* Update: Admin refresh.

= 3.5.4 =
* Fix: Default order issue.
* Fix: Run mglInitMaps only if there is a map on the page.

= 3.5.3 =
* Add: New layout for Pro: The Map Layout. Please try it and let us know what you think :)
* Fix: Admin Updater.
* Fix: Remove the call to gallery_written which was allowing theme to break the Meow Gallery. If this causes an issue, an option will be added instead.

= 3.5.0 =
* Add: The two new attributes 'orderby' and 'order'. You can learn more about them here: https://meowapps.com/meow-gallery-tutorial/#Gallery_Shortcode.
* Fix: A bunch of little fixes.

= 3.4.8 =
* Fix: Carousel dots.
* Fix: iiooi layout was 103%.

= 3.4.7 =
* Fix: Responsive for Tiles and Square layouts.

= 3.4.6 =
* Fix: Justified layout had... issues. Sorry about that!
* Add: Meow Gallery can now be converted into Gutenberg Gallery or (and from) Image Blocks.
* Update: Little optimization for the rendering.

= 3.4.4 =
* Fix: Return the WordPress default gallery if None is selected (and no layout).
* Update: Lazy doesn't use an 1x1 external image anymore, but a tiny inline SVG.

= 3.4.2 =
* Add: Support for custom classes.
* Fix: CSS issue for caption in some cases.
* Fix: There were issues when using Infinite with a specific Image Size.

= 3.4.0 =
* Fix: One (actually useless) argument was missing to the post_gallery filter.
* Update: Avoid having one photo left alone when using the Tiles Layout.

= 3.3.6 =
* Add: Possibility to switch between src-set and precise image sizes (thumbnail, medium, large, full).
* Fix: Namespace conflict with carousel.

= 3.3.4 =
* Fix: Added a new class to the images (might be important for other plugins).
* Fix: A few CSS glitches were corrected.
* Add: Container for the gallery and its inline CSS, to avoid breaking DOM parsers.
* Fix: Default CSS behavior/style is missing for some theme and was affecting the Justified layout.

= 3.3.0 =
* Add: Filter mgl_sort to build your own customized order. Check more about this [here](https://meowapps.com/meow-gallery-tutorial/#Order_Sort).
* Fix: JetPack Lazy.
* Fix: Visual glitches.

= 3.2.9 =
* Update: The Slider is now the Carousel (for Pro).
* Update: Larger sizes to avoid pixelization (if any issue, check the filters).
* Add: New filters (https://meowapps.com/meow-gallery-tutorial/#Customize_the_Meow_Gallery).
* Fix: Tiles layout issue.

= 3.2.4 =
* Fix: Compatibility with PHP... 5! :) (the plugin was made for PHP 7+).
* Fix: An invisible character was breaking the gallery attributes.
* Add: Added animations.

= 3.1.0 =
* Update: Added a filter which is also used by the standard WP Gallery for compatibility with other plugins.
* Fix: Compatibility with WordPress 5.0.
* Fix: The include attribute in the shortcode was not working.

= 3.0.6 =
* Add: Compatibility with WP/LR Sync. Collections from Lightroom are now accessible from the Meow Gallery Gutenberg Block.
* Add: LinkTo in the block.
* Add: Cascade layout.
* Info: Huge update for Gutenberg and WordPress 5. Try it :)

= 2.0.9 =
* Fix: For Gutenberg last update compatibility.
* Fix: Convert special characters in captions to HTML entities to avoid breaking standard HTML.
* Fix: Compatibility issue with WP/LR Sync.
* Update: Randomize identical layouts for Tiles.
* Fix: Function filemtime seems to fail on a few installs, so added alternative for it.

= 2.0.4 =
* Update: Enhanced Tiles layout.
* Update: Optimize CSS.
* Fix: Issue in the Slider constructor.

= 2.0.2 =
* Update: Complete recoding of the Meow Gallery! Harder, Better, Faster, Stronger.
* Add: Add Meow Gallery setting in the Gallery Block in Gutenberg.
* Fix: Gutenberg compatibility.

= 1.1.2 =
* Fix: Gutenberg compatibility.
* Fix: Issue with Infinite.
* Fix: Compatibility with PHP prior to 5.6.3.
* Update: Support for WP 4.9.

= 1.0.4 =
* Add: i18n.
* Fix: Better Justified layout.
* Fix: W3C validation.
* Fix: Compatibility with prehistoric themes.
* Fix: Gallery width.
* Fix: Issues with PHP < 7.

= 1.0.0 =
* Add: Optimization of the Infinite Loading.
* Fix: Now really uses the core WP Gallery 100% naturally.
* Fix: Many fixes.

= 0.2.5 =
* Add: Instagram Layout.
* Fix: Many little fixes.
* Add: Filter that allows changes in the images list (used by WP/LR Sync).

= 0.2.2 =
* Add: Justified layout.
* Fix: Many little fixes.

= 0.1.6 =
* Fix: Many fixes, many updates, revamped.
* Add: Pro -> Infinite loading, with options

= 0.0.3 =
* Tiny fixes.

= 0.0.1 =
* First release.

== Screenshots ==

1. Meow Gallery.
