<?php

namespace App\Support;

use Illuminate\Validation\Validator;

/**
 * Central definition of the block types this CMS understands.
 *
 * Adding a new block type later only means adding one entry to
 * REQUIRED_DATA_KEYS (and a matching Vue component)
 */
class ContentBlockTypes
{
    public const HERO = 'hero';
    public const TEXT = 'text';
    public const CTA = 'cta';

    /**
     * type => required keys inside the `data` JSON payload.
     */
    private const REQUIRED_DATA_KEYS = [
        self::HERO => ['heading'],
        self::TEXT => ['content'],
        self::CTA => ['button_label', 'button_url'],
    ];

    /**
     * All block type identifiers currently supported.
     */
    public static function all(): array
    {
        return array_keys(self::REQUIRED_DATA_KEYS);
    }

    /**
     * Required keys for a given block type's `data` payload.
     */
    public static function requiredDataKeys(string $type): array
    {
        return self::REQUIRED_DATA_KEYS[$type] ?? [];
    }

    /**
     * Attach an "after" check to a validator instance that verifies
     * the `data` payload contains the keys required for `type`,
     * and that each of those keys holds a non-empty string.
     */
    public static function validateShape(Validator $validator, ?string $type, mixed $data): void
    {
        if (! $type || ! is_array($data)) {
            return;
        }

        foreach (self::requiredDataKeys($type) as $key) {
            $value = $data[$key] ?? null;

            if (! is_string($value) || trim($value) === '') {
                $validator->errors()->add(
                    "data.{$key}",
                    "The data.{$key} field is required for a \"{$type}\" block."
                );
            }
        }
    }
}