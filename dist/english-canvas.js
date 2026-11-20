// Long English labels must fit existing phone screens, badges, signs and TV textures.
if (globalThis.CanvasRenderingContext2D) {
  const original = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    const width = this.canvas.width;
    const available = this.textAlign === 'center' ? Math.min(x, width - x) * 2 - 8
      : this.textAlign === 'right' || this.textAlign === 'end' ? x - 8 : width - x - 8;
    return original.call(this, text, x, y, Math.max(1, Math.min(maxWidth ?? width, available)));
  };
}
