<style>
	<?php if ( isset( $args['settings']['billing'] ) && is_array( $args['settings']['billing'] ) ) : ?>
	    <?php foreach ( $args['settings']['billing'] as $field ) : ?>
	        <?php if ( ( $field['required'] ?? '' ) == '0' && ( $field['custom_field'] ?? '' ) != '1' ) : ?>
	            #<?php echo esc_attr( $field['name'] ); ?>_field abbr {
	                display: none !important;
	            }
	        <?php endif; ?>
	    <?php endforeach; ?>
	<?php endif; ?>

	<?php if ( isset( $args['settings']['shipping'] ) && is_array( $args['settings']['shipping'] ) ) : ?>
	    <?php foreach ( $args['settings']['shipping'] as $field ) : ?>
	        <?php if ( ( $field['required'] ?? '' ) == '0' && ( $field['custom_field'] ?? '' ) != '1' ) : ?>
	            #<?php echo esc_attr( $field['name'] ); ?>_field abbr {
	                display: none !important;
	            }
	        <?php endif; ?>
	    <?php endforeach; ?>
	<?php endif; ?>
</style>

<script type="text/javascript">
	window.addEventListener('load', function() {
		<?php if ( isset( $args['settings']['billing'] ) && is_array( $args['settings']['billing'] ) ) : ?>
			<?php foreach ( $args['settings']['billing'] as $field ) : ?>
				<?php if ( ( $field['required'] ?? '' ) == '0' && ( $field['custom_field'] ?? '' ) != '1' ) : ?>
					document.getElementById('<?php echo esc_attr( $field['name'] ); ?>_field')?.classList.remove('validate-required');
				<?php endif; ?>
			<?php endforeach; ?>
		<?php endif; ?>
		<?php if ( isset( $args['settings']['shipping'] ) && is_array( $args['settings']['shipping'] ) ) : ?>
			<?php foreach ( $args['settings']['shipping'] as $field ) : ?>
				<?php if ( ( $field['required'] ?? '' ) == '0' && ( $field['custom_field'] ?? '' ) != '1' ) : ?>
					document.getElementById('<?php echo esc_attr( $field['name'] ); ?>_field')?.classList.remove('validate-required');
				<?php endif; ?>
			<?php endforeach; ?>
		<?php endif; ?>
	});
	var fcf_ajaxurl = '<?php echo admin_url( 'admin-ajax.php' ); ?>';
	var inspire_upload_nonce = '<?php echo wp_create_nonce( 'inspire_upload_nonce' ); ?>';
</script>
