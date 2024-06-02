<figure class="mgl-item"<?php echo wp_kses_post( $attributes ) ?>>
	<div class="mgl-icon">
		<div class="mgl-img-container">
			<?php if ( !$isPreview && $linkUrl ): ?>
				<a href="<?php echo esc_url( $linkUrl ) ?>">
						<?= 
							wp_kses( $imgSrc, [ 
								'img' => [
									'src'      => true,
									'srcset'   => true,
									'loading'	 => true,
									'sizes'    => true,
									'class'    => true,
									'id'       => true,
									'width'    => true,
									'height'   => true,
									'alt'      => true,
									'align'    => true,
									]
								] 
							);
						?>
				</a>
			<?php else: ?>
				<?= 
					wp_kses( $imgSrc, [ 
						'img' => [
							'src'      => true,
							'srcset'   => true,
							'loading'	 => true,
							'sizes'    => true,
							'class'    => true,
							'id'       => true,
							'width'    => true,
							'height'   => true,
							'alt'      => true,
							'align'    => true,
							]
						] 
					);
				?>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( !empty( $caption ) ): ?>
	<figcaption class="mgl-caption">
			<p><?php echo wp_kses_post( $caption ) ?></p>
	</figcaption>
	<?php endif; ?>
</figure>
