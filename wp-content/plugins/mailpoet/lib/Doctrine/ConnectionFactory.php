<?php // phpcs:ignore SlevomatCodingStandard.TypeHints.DeclareStrictTypes.DeclareStrictTypesMissing

namespace MailPoet\Doctrine;

if (!defined('ABSPATH')) exit;


use MailPoet\Doctrine\Middlewares\PostConnectMiddleware;
use MailPoet\Doctrine\Types\BigIntType;
use MailPoet\Doctrine\Types\DateTimeTzToStringType;
use MailPoet\Doctrine\Types\JsonOrSerializedType;
use MailPoet\Doctrine\Types\JsonType;
use MailPoet\Doctrine\Types\SerializedArrayType;
use MailPoet\Doctrine\WPDB\Driver as WPDBDriver;
use MailPoetVendor\Doctrine\DBAL\Configuration;
use MailPoetVendor\Doctrine\DBAL\Driver;
use MailPoetVendor\Doctrine\DBAL\Driver\Middleware;
use MailPoetVendor\Doctrine\DBAL\DriverManager;
use MailPoetVendor\Doctrine\DBAL\Platforms\MySQLPlatform;
use MailPoetVendor\Doctrine\DBAL\Types\Type;

class ConnectionFactory {
  const DRIVER_CLASS = WPDBDriver::class;
  const PLATFORM_CLASS = MySQLPlatform::class;

  private $types = [
    BigIntType::NAME => BigIntType::class,
    DateTimeTzToStringType::NAME => DateTimeTzToStringType::class,
    JsonType::NAME => JsonType::class,
    JsonOrSerializedType::NAME => JsonOrSerializedType::class,
    SerializedArrayType::NAME => SerializedArrayType::class,
  ];

  public function createConnection() {
    $platformClass = self::PLATFORM_CLASS;
    $connectionParams = [
      'driverClass' => self::DRIVER_CLASS,
      'platform' => new $platformClass,
    ];

    $this->setupTypes();
    return DriverManager::getConnection($connectionParams, $this->getConfiguration());
  }

  private function setupTypes() {
    foreach ($this->types as $name => $class) {
      if (Type::hasType($name)) {
        Type::overrideType($name, $class);
      } else {
        Type::addType($name, $class);
      }
    }
  }

  private function getConfiguration(): Configuration {
    $config = new Configuration();
    $driverMiddleware = new class implements Middleware {
      public function wrap(Driver $driver): Driver {
        return new PostConnectMiddleware($driver);
      }
    };
    $config->setMiddlewares([$driverMiddleware]);
    return $config;
  }
}
