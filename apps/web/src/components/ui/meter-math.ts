export interface MeterSegmentInput {
    value: number
}

/** `value` as a share of `max`, kept between 0 and 100. A zero, negative or missing `max`, or a non-number, gives 0. */
export function meterPercent(value: number, max: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0
    return Math.min(100, Math.max(0, (value / max) * 100))
}

/** The width of each segment as a percent of the bar. Segments are drawn end to end, so together they never pass 100. */
export function segmentWidths(segments: MeterSegmentInput[], max: number): number[] {
    let used = 0
    return segments.map((segment) => {
        const width = Math.min(meterPercent(segment.value, max), 100 - used)
        used += width
        return width
    })
}
