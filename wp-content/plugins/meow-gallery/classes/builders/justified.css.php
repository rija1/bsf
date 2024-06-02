<style>

	<?php echo esc_attr( $class_id ) ?> {
		display: <?php echo ($isPreview ? 'block' : 'none') ?>;
		margin: <?php echo -1 * $gutter/2 ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item {
		margin: <?php echo (int)$gutter / 2 ?>px;
	}

</style>
